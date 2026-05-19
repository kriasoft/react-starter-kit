import {
  claraActivesoftLaunchLog,
  claraAttendanceRecord,
  claraClass,
  claraEnrollment,
  claraEventParticipant,
  claraIndividualStudentRecord,
  claraLessonSession,
  claraPedagogicalEvent,
  claraReviewAction,
  claraSchool,
  claraStudent,
  claraSubject,
  claraTeacherProfile,
  member,
} from "@repo/db/schema";
import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  getActiveSoftProbeSummary,
  tryParseActiveSoftConfig,
} from "../lib/activesoft.js";
import {
  buildMissingHomeworkEventDraft,
  CLARA_REVIEW_STATUS,
} from "../lib/clara-records.js";
import {
  getDuplicateStudentIds,
  getMissingEnrolledStudentIds,
  selectEnrolledStudentsById,
  type ClaraEnrolledStudent,
} from "../lib/clara-students.js";
import { protectedProcedure, router } from "../lib/trpc.js";
import type { TRPCContext } from "../lib/context.js";

const dateInput = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const attendanceStatusInput = z.enum([
  "present",
  "absent",
  "excused_absence",
  "late",
  "early_departure",
  "not_informed",
]);

type ClaraAccess = {
  organizationId: string;
  schoolId: string;
  role: string;
  canCoordinate: boolean;
  teacherProfileId: string | null;
};

export const claraRouter = router({
  integration: router({
    activesoftProbe: protectedProcedure.query(({ ctx }) => {
      const config = tryParseActiveSoftConfig(ctx.env);

      return {
        summary: getActiveSoftProbeSummary(config),
        writesEnabled: false,
        documentedReadOnlyChecks: ["api/v1/listar_frequencia_aluno/?aluno_id="],
        documentedFrequencyWrite: "api/v1/marcar_frequencia_aluno/",
        occurrenceWrites: "blocked_until_official_contract",
      };
    }),
  }),

  teacher: router({
    today: protectedProcedure
      .input(z.object({ date: dateInput.optional() }).optional())
      .query(async ({ ctx, input }) => {
        const access = await resolveClaraAccess(ctx, { allowMissing: true });

        if (!access) {
          return {
            setupRequired: true,
            lessons: [],
          };
        }

        const selectedDate = parseDate(input?.date);
        const conditions = [
          eq(claraLessonSession.schoolId, access.schoolId),
          eq(claraLessonSession.scheduledDate, selectedDate),
        ];

        if (!access.canCoordinate) {
          if (!access.teacherProfileId) {
            return {
              setupRequired: false,
              lessons: [],
            };
          }
          conditions.push(
            eq(claraLessonSession.teacherProfileId, access.teacherProfileId),
          );
        }

        const lessons = await ctx.db
          .select({
            id: claraLessonSession.id,
            classId: claraLessonSession.classId,
            className: claraClass.name,
            subjectName: claraSubject.name,
            startsAt: claraLessonSession.startsAt,
            endsAt: claraLessonSession.endsAt,
            status: claraLessonSession.status,
          })
          .from(claraLessonSession)
          .innerJoin(claraClass, eq(claraLessonSession.classId, claraClass.id))
          .innerJoin(
            claraSubject,
            eq(claraLessonSession.subjectId, claraSubject.id),
          )
          .where(and(...conditions))
          .orderBy(asc(claraLessonSession.startsAt));

        return {
          setupRequired: false,
          lessons: await Promise.all(
            lessons.map(async (lesson) => {
              const students = await listStudentsForClass(ctx, lesson.classId);
              const attendance = await ctx.db
                .select({
                  studentId: claraAttendanceRecord.studentId,
                  status: claraAttendanceRecord.status,
                })
                .from(claraAttendanceRecord)
                .where(eq(claraAttendanceRecord.lessonSessionId, lesson.id));
              const attendanceByStudent = new Map(
                attendance.map((record) => [record.studentId, record.status]),
              );

              return {
                ...lesson,
                students: students.map((student) => ({
                  ...student,
                  attendanceStatus:
                    attendanceByStudent.get(student.id) ?? "not_informed",
                })),
              };
            }),
          ),
        };
      }),

    startLesson: protectedProcedure
      .input(z.object({ lessonSessionId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const access = await requireClaraAccess(ctx);
        await requireLessonAccess(ctx, access, input.lessonSessionId);

        const [lesson] = await ctx.dbDirect
          .update(claraLessonSession)
          .set({ status: "in_progress" })
          .where(eq(claraLessonSession.id, input.lessonSessionId))
          .returning({
            id: claraLessonSession.id,
            status: claraLessonSession.status,
          });

        return lesson;
      }),

    recordAttendance: protectedProcedure
      .input(
        z.object({
          lessonSessionId: z.string().min(1),
          records: z.array(
            z.object({
              studentId: z.string().min(1),
              status: attendanceStatusInput,
            }),
          ),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const access = await requireClaraAccess(ctx);
        const lesson = await requireLessonAccess(
          ctx,
          access,
          input.lessonSessionId,
        );
        const enrolledStudents = await listStudentsForClass(
          ctx,
          lesson.classId,
        );
        requireEnrolledUniqueStudents(
          input.records.map((record) => record.studentId),
          enrolledStudents,
        );

        await ctx.dbDirect.transaction(async (tx) => {
          for (const record of input.records) {
            await tx
              .insert(claraAttendanceRecord)
              .values({
                schoolId: access.schoolId,
                lessonSessionId: input.lessonSessionId,
                studentId: record.studentId,
                status: record.status,
                source: "teacher",
                recordedByUserId: ctx.user.id,
              })
              .onConflictDoUpdate({
                target: [
                  claraAttendanceRecord.lessonSessionId,
                  claraAttendanceRecord.studentId,
                ],
                set: {
                  status: record.status,
                  source: "teacher",
                  recordedByUserId: ctx.user.id,
                  recordedAt: new Date(),
                  updatedAt: new Date(),
                },
              });
          }
        });

        return { success: true, recorded: input.records.length };
      }),

    recordMissingHomework: protectedProcedure
      .input(
        z.object({
          lessonSessionId: z.string().min(1),
          studentIds: z.array(z.string().min(1)).min(1),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const access = await requireClaraAccess(ctx);
        const lesson = await requireLessonAccess(
          ctx,
          access,
          input.lessonSessionId,
        );
        const enrolledStudents = await listStudentsForClass(
          ctx,
          lesson.classId,
        );

        requireEnrolledUniqueStudents(input.studentIds, enrolledStudents);

        const students = selectEnrolledStudentsById(
          input.studentIds,
          enrolledStudents,
        );

        const draft = buildMissingHomeworkEventDraft({
          schoolId: access.schoolId,
          lessonSessionId: input.lessonSessionId,
          createdByUserId: ctx.user.id,
          className: lesson.className,
          subjectName: lesson.subjectName,
          selectedStudents: students,
        });

        const created = await ctx.dbDirect.transaction(async (tx) => {
          const [event] = await tx
            .insert(claraPedagogicalEvent)
            .values(draft.event)
            .returning({ id: claraPedagogicalEvent.id });

          if (!event) {
            throw new Error("Failed to create Clara event");
          }

          await tx.insert(claraEventParticipant).values(
            draft.participants.map((participant) => ({
              eventId: event.id,
              ...participant,
            })),
          );

          const records = await tx
            .insert(claraIndividualStudentRecord)
            .values(
              draft.records.map((record) => ({
                schoolId: access.schoolId,
                eventId: event.id,
                studentId: record.studentId,
                rawTeacherNote: record.rawTeacherNote,
                normalizedInternalSummary: record.normalizedInternalSummary,
                activesoftObservationDraft: record.activesoftObservationDraft,
                familyMessageDraft: record.familyMessageDraft,
                visibilityToFamily: record.visibilityToFamily,
                reviewStatus: record.reviewStatus,
              })),
            )
            .returning({ id: claraIndividualStudentRecord.id });

          return { eventId: event.id, recordIds: records.map((r) => r.id) };
        });

        return created;
      }),
  }),

  coordination: router({
    reviewQueue: protectedProcedure.query(async ({ ctx }) => {
      const access = await requireClaraAccess(ctx);
      requireCoordinator(access);

      return await ctx.db
        .select({
          id: claraIndividualStudentRecord.id,
          studentName: claraStudent.displayName,
          reviewStatus: claraIndividualStudentRecord.reviewStatus,
          sensitiveCase: claraPedagogicalEvent.sensitiveCase,
          eventType: claraPedagogicalEvent.eventType,
          className: claraClass.name,
          subjectName: claraSubject.name,
          activesoftObservationDraft:
            claraIndividualStudentRecord.activesoftObservationDraft,
          approvedActivesoftObservation:
            claraIndividualStudentRecord.approvedActivesoftObservation,
          visibilityToFamily: claraIndividualStudentRecord.visibilityToFamily,
          createdAt: claraIndividualStudentRecord.createdAt,
        })
        .from(claraIndividualStudentRecord)
        .innerJoin(
          claraStudent,
          eq(claraIndividualStudentRecord.studentId, claraStudent.id),
        )
        .innerJoin(
          claraPedagogicalEvent,
          eq(claraIndividualStudentRecord.eventId, claraPedagogicalEvent.id),
        )
        .innerJoin(
          claraLessonSession,
          eq(claraPedagogicalEvent.lessonSessionId, claraLessonSession.id),
        )
        .innerJoin(claraClass, eq(claraLessonSession.classId, claraClass.id))
        .innerJoin(
          claraSubject,
          eq(claraLessonSession.subjectId, claraSubject.id),
        )
        .where(eq(claraIndividualStudentRecord.schoolId, access.schoolId))
        .orderBy(asc(claraIndividualStudentRecord.createdAt));
    }),

    approveRecord: protectedProcedure
      .input(
        z.object({
          recordId: z.string().min(1),
          approvedActivesoftObservation: z.string().min(1).max(3000),
          approvedFamilyMessage: z.string().max(3000).optional(),
          visibilityToFamily: z.boolean().default(false),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const access = await requireClaraAccess(ctx);
        requireCoordinator(access);

        const [current] = await ctx.db
          .select({
            id: claraIndividualStudentRecord.id,
            schoolId: claraIndividualStudentRecord.schoolId,
            reviewStatus: claraIndividualStudentRecord.reviewStatus,
            sensitiveCase: claraPedagogicalEvent.sensitiveCase,
          })
          .from(claraIndividualStudentRecord)
          .innerJoin(
            claraPedagogicalEvent,
            eq(claraIndividualStudentRecord.eventId, claraPedagogicalEvent.id),
          )
          .where(
            and(
              eq(claraIndividualStudentRecord.id, input.recordId),
              eq(claraIndividualStudentRecord.schoolId, access.schoolId),
            ),
          )
          .limit(1);

        if (!current) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Record not found",
          });
        }

        if (input.visibilityToFamily && current.sensitiveCase) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Sensitive records cannot be made family-visible here",
          });
        }

        await ctx.dbDirect.transaction(async (tx) => {
          await tx
            .update(claraIndividualStudentRecord)
            .set({
              approvedActivesoftObservation:
                input.approvedActivesoftObservation,
              approvedFamilyMessage: input.approvedFamilyMessage,
              visibilityToFamily: input.visibilityToFamily,
              reviewStatus: CLARA_REVIEW_STATUS.approvedForActivesoft,
              approvedByUserId: ctx.user.id,
              approvedAt: new Date(),
            })
            .where(eq(claraIndividualStudentRecord.id, input.recordId));

          await tx.insert(claraReviewAction).values({
            schoolId: access.schoolId,
            individualRecordId: input.recordId,
            action: "approve_for_activesoft",
            fromStatus: current.reviewStatus,
            toStatus: CLARA_REVIEW_STATUS.approvedForActivesoft,
            actedByUserId: ctx.user.id,
          });
        });

        return { success: true };
      }),

    logActivesoftLaunch: protectedProcedure
      .input(
        z.object({
          recordId: z.string().min(1),
          activesoftReference: z.string().max(255).optional(),
          internetVisible: z.boolean().default(false),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const access = await requireClaraAccess(ctx);
        requireCoordinator(access);

        const [current] = await ctx.db
          .select({
            id: claraIndividualStudentRecord.id,
            schoolId: claraIndividualStudentRecord.schoolId,
            reviewStatus: claraIndividualStudentRecord.reviewStatus,
            approvedActivesoftObservation:
              claraIndividualStudentRecord.approvedActivesoftObservation,
            sensitiveCase: claraPedagogicalEvent.sensitiveCase,
          })
          .from(claraIndividualStudentRecord)
          .innerJoin(
            claraPedagogicalEvent,
            eq(claraIndividualStudentRecord.eventId, claraPedagogicalEvent.id),
          )
          .where(
            and(
              eq(claraIndividualStudentRecord.id, input.recordId),
              eq(claraIndividualStudentRecord.schoolId, access.schoolId),
            ),
          )
          .limit(1);

        if (!current?.approvedActivesoftObservation) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only approved records can be launched in ActiveSoft",
          });
        }

        if (input.internetVisible && current.sensitiveCase) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Sensitive records cannot set Exibir na internet",
          });
        }

        await ctx.dbDirect.transaction(async (tx) => {
          await tx.insert(claraActivesoftLaunchLog).values({
            schoolId: access.schoolId,
            individualRecordId: input.recordId,
            launchedByUserId: ctx.user.id,
            activesoftReference: input.activesoftReference,
            internetVisible: input.internetVisible,
          });

          await tx
            .update(claraIndividualStudentRecord)
            .set({
              reviewStatus: CLARA_REVIEW_STATUS.launchedInActivesoft,
            })
            .where(eq(claraIndividualStudentRecord.id, input.recordId));

          await tx.insert(claraReviewAction).values({
            schoolId: access.schoolId,
            individualRecordId: input.recordId,
            action: "log_activesoft_launch",
            fromStatus: current.reviewStatus,
            toStatus: CLARA_REVIEW_STATUS.launchedInActivesoft,
            actedByUserId: ctx.user.id,
          });
        });

        return { success: true };
      }),
  }),
});

async function resolveClaraAccess(
  ctx: TRPCContext & {
    session: NonNullable<TRPCContext["session"]>;
    user: NonNullable<TRPCContext["user"]>;
  },
  options: { allowMissing: true },
): Promise<ClaraAccess | null>;
async function resolveClaraAccess(
  ctx: TRPCContext & {
    session: NonNullable<TRPCContext["session"]>;
    user: NonNullable<TRPCContext["user"]>;
  },
  options?: { allowMissing?: false },
): Promise<ClaraAccess>;
async function resolveClaraAccess(
  ctx: TRPCContext & {
    session: NonNullable<TRPCContext["session"]>;
    user: NonNullable<TRPCContext["user"]>;
  },
  options: { allowMissing?: boolean } = {},
): Promise<ClaraAccess | null> {
  const activeOrganizationId = ctx.session.activeOrganizationId;

  const membershipConditions = [eq(member.userId, ctx.user.id)];
  if (activeOrganizationId) {
    membershipConditions.push(eq(member.organizationId, activeOrganizationId));
  }

  const [membership] = await ctx.db
    .select({
      organizationId: member.organizationId,
      role: member.role,
    })
    .from(member)
    .where(and(...membershipConditions))
    .limit(1);

  if (!membership) {
    if (options.allowMissing) return null;
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No Clara organization membership found",
    });
  }

  const [school] = await ctx.db
    .select({ id: claraSchool.id })
    .from(claraSchool)
    .where(eq(claraSchool.organizationId, membership.organizationId))
    .limit(1);

  if (!school) {
    if (options.allowMissing) return null;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No Clara school configured for the active organization",
    });
  }

  const [teacherProfile] = await ctx.db
    .select({ id: claraTeacherProfile.id })
    .from(claraTeacherProfile)
    .where(
      and(
        eq(claraTeacherProfile.schoolId, school.id),
        eq(claraTeacherProfile.userId, ctx.user.id),
      ),
    )
    .limit(1);

  return {
    organizationId: membership.organizationId,
    schoolId: school.id,
    role: membership.role,
    canCoordinate: ["owner", "admin", "coordination", "direction"].includes(
      membership.role,
    ),
    teacherProfileId: teacherProfile?.id ?? null,
  };
}

async function requireClaraAccess(
  ctx: TRPCContext & {
    session: NonNullable<TRPCContext["session"]>;
    user: NonNullable<TRPCContext["user"]>;
  },
) {
  return await resolveClaraAccess(ctx);
}

function requireCoordinator(access: ClaraAccess) {
  if (!access.canCoordinate) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Coordination access required",
    });
  }
}

function requireEnrolledUniqueStudents(
  requestedStudentIds: string[],
  enrolledStudents: ClaraEnrolledStudent[],
) {
  const duplicateStudentIds = getDuplicateStudentIds(requestedStudentIds);

  if (duplicateStudentIds.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Student IDs must be unique for a lesson action",
    });
  }

  const missingStudentIds = getMissingEnrolledStudentIds(
    requestedStudentIds,
    enrolledStudents,
  );

  if (missingStudentIds.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Selected students must be enrolled in this class",
    });
  }
}

async function requireLessonAccess(
  ctx: TRPCContext,
  access: ClaraAccess,
  lessonSessionId: string,
) {
  const conditions = [
    eq(claraLessonSession.id, lessonSessionId),
    eq(claraLessonSession.schoolId, access.schoolId),
  ];

  if (!access.canCoordinate) {
    if (!access.teacherProfileId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Teacher profile required",
      });
    }
    conditions.push(
      eq(claraLessonSession.teacherProfileId, access.teacherProfileId),
    );
  }

  const [lesson] = await ctx.db
    .select({
      id: claraLessonSession.id,
      schoolId: claraLessonSession.schoolId,
      classId: claraLessonSession.classId,
      className: claraClass.name,
      subjectName: claraSubject.name,
    })
    .from(claraLessonSession)
    .innerJoin(claraClass, eq(claraLessonSession.classId, claraClass.id))
    .innerJoin(claraSubject, eq(claraLessonSession.subjectId, claraSubject.id))
    .where(and(...conditions))
    .limit(1);

  if (!lesson) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
  }

  return lesson;
}

async function listStudentsForClass(ctx: TRPCContext, classId: string) {
  return await ctx.db
    .select({
      id: claraStudent.id,
      displayName: claraStudent.displayName,
    })
    .from(claraEnrollment)
    .innerJoin(claraStudent, eq(claraEnrollment.studentId, claraStudent.id))
    .where(
      and(
        eq(claraEnrollment.classId, classId),
        eq(claraEnrollment.status, "active"),
      ),
    )
    .orderBy(asc(claraStudent.displayName));
}

function parseDate(value: string | undefined) {
  const date = value ?? new Date().toISOString().slice(0, 10);
  return new Date(`${date}T00:00:00.000Z`);
}
