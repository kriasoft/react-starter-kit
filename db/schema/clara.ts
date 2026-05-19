import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { generateId } from "./id";
import { organization } from "./organization";
import { user } from "./user";

const timestamps = {
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const claraSchool = pgTable(
  "clara_school",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("sch")),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text().notNull(),
    activesoftSchoolId: text(),
    ...timestamps,
  },
  (table) => [
    index("clara_school_organization_id_idx").on(table.organizationId),
  ],
);

export type ClaraSchool = typeof claraSchool.$inferSelect;
export type NewClaraSchool = typeof claraSchool.$inferInsert;

export const claraTerm = pgTable(
  "clara_term",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("trm")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    name: text().notNull(),
    startsOn: date({ mode: "date" }).notNull(),
    endsOn: date({ mode: "date" }).notNull(),
    status: text().notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    index("clara_term_school_id_idx").on(table.schoolId),
    unique("clara_term_id_school_unique").on(table.id, table.schoolId),
    check(
      "clara_term_valid_date_range",
      sql`${table.endsOn} >= ${table.startsOn}`,
    ),
  ],
);

export const claraSubject = pgTable(
  "clara_subject",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("sub")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    name: text().notNull(),
    code: text(),
    ...timestamps,
  },
  (table) => [
    index("clara_subject_school_id_idx").on(table.schoolId),
    unique("clara_subject_id_school_unique").on(table.id, table.schoolId),
    unique("clara_subject_school_name_unique").on(table.schoolId, table.name),
  ],
);

export const claraClass = pgTable(
  "clara_class",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("cls")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    termId: text()
      .notNull()
      .references(() => claraTerm.id, { onDelete: "cascade" }),
    name: text().notNull(),
    grade: text(),
    shift: text(),
    activesoftClassId: text(),
    ...timestamps,
  },
  (table) => [
    index("clara_class_school_id_idx").on(table.schoolId),
    index("clara_class_term_id_idx").on(table.termId),
    unique("clara_class_id_school_unique").on(table.id, table.schoolId),
    unique("clara_class_school_term_name_unique").on(
      table.schoolId,
      table.termId,
      table.name,
    ),
    foreignKey({
      name: "clara_class_term_school_fk",
      columns: [table.termId, table.schoolId],
      foreignColumns: [claraTerm.id, claraTerm.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraTeacherProfile = pgTable(
  "clara_teacher_profile",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("tpr")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    displayName: text().notNull(),
    activesoftTeacherId: text(),
    ...timestamps,
  },
  (table) => [
    index("clara_teacher_profile_school_id_idx").on(table.schoolId),
    index("clara_teacher_profile_user_id_idx").on(table.userId),
    unique("clara_teacher_profile_id_school_unique").on(
      table.id,
      table.schoolId,
    ),
    unique("clara_teacher_profile_school_user_unique").on(
      table.schoolId,
      table.userId,
    ),
  ],
);

export const claraTeacherAssignment = pgTable(
  "clara_teacher_assignment",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("asg")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    teacherProfileId: text()
      .notNull()
      .references(() => claraTeacherProfile.id, { onDelete: "cascade" }),
    classId: text()
      .notNull()
      .references(() => claraClass.id, { onDelete: "cascade" }),
    subjectId: text()
      .notNull()
      .references(() => claraSubject.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    index("clara_teacher_assignment_school_id_idx").on(table.schoolId),
    index("clara_teacher_assignment_teacher_profile_id_idx").on(
      table.teacherProfileId,
    ),
    index("clara_teacher_assignment_class_id_idx").on(table.classId),
    index("clara_teacher_assignment_subject_id_idx").on(table.subjectId),
    unique("clara_teacher_assignment_unique").on(
      table.teacherProfileId,
      table.classId,
      table.subjectId,
    ),
    foreignKey({
      name: "clara_teacher_assignment_teacher_school_fk",
      columns: [table.teacherProfileId, table.schoolId],
      foreignColumns: [claraTeacherProfile.id, claraTeacherProfile.schoolId],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_teacher_assignment_class_school_fk",
      columns: [table.classId, table.schoolId],
      foreignColumns: [claraClass.id, claraClass.schoolId],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_teacher_assignment_subject_school_fk",
      columns: [table.subjectId, table.schoolId],
      foreignColumns: [claraSubject.id, claraSubject.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraStudent = pgTable(
  "clara_student",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("stu")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    displayName: text().notNull(),
    activesoftStudentId: text(),
    status: text().notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    index("clara_student_school_id_idx").on(table.schoolId),
    unique("clara_student_id_school_unique").on(table.id, table.schoolId),
  ],
);

export const claraEnrollment = pgTable(
  "clara_enrollment",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("enr")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    classId: text()
      .notNull()
      .references(() => claraClass.id, { onDelete: "cascade" }),
    studentId: text()
      .notNull()
      .references(() => claraStudent.id, { onDelete: "cascade" }),
    status: text().notNull().default("active"),
    ...timestamps,
  },
  (table) => [
    index("clara_enrollment_school_id_idx").on(table.schoolId),
    index("clara_enrollment_class_id_idx").on(table.classId),
    index("clara_enrollment_student_id_idx").on(table.studentId),
    unique("clara_enrollment_class_student_unique").on(
      table.classId,
      table.studentId,
    ),
    foreignKey({
      name: "clara_enrollment_class_school_fk",
      columns: [table.classId, table.schoolId],
      foreignColumns: [claraClass.id, claraClass.schoolId],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_enrollment_student_school_fk",
      columns: [table.studentId, table.schoolId],
      foreignColumns: [claraStudent.id, claraStudent.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraLessonSession = pgTable(
  "clara_lesson_session",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("les")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    classId: text()
      .notNull()
      .references(() => claraClass.id, { onDelete: "cascade" }),
    subjectId: text()
      .notNull()
      .references(() => claraSubject.id, { onDelete: "cascade" }),
    teacherProfileId: text()
      .notNull()
      .references(() => claraTeacherProfile.id, { onDelete: "cascade" }),
    scheduledDate: date({ mode: "date" }).notNull(),
    startsAt: text().notNull(),
    endsAt: text().notNull(),
    status: text().notNull().default("scheduled"),
    ...timestamps,
  },
  (table) => [
    index("clara_lesson_session_school_id_idx").on(table.schoolId),
    index("clara_lesson_session_class_id_idx").on(table.classId),
    index("clara_lesson_session_subject_id_idx").on(table.subjectId),
    index("clara_lesson_session_teacher_profile_id_idx").on(
      table.teacherProfileId,
    ),
    index("clara_lesson_session_scheduled_date_idx").on(table.scheduledDate),
    unique("clara_lesson_session_id_school_unique").on(
      table.id,
      table.schoolId,
    ),
    foreignKey({
      name: "clara_lesson_session_class_school_fk",
      columns: [table.classId, table.schoolId],
      foreignColumns: [claraClass.id, claraClass.schoolId],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_lesson_session_subject_school_fk",
      columns: [table.subjectId, table.schoolId],
      foreignColumns: [claraSubject.id, claraSubject.schoolId],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_lesson_session_teacher_school_fk",
      columns: [table.teacherProfileId, table.schoolId],
      foreignColumns: [claraTeacherProfile.id, claraTeacherProfile.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraAttendanceRecord = pgTable(
  "clara_attendance_record",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("att")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    lessonSessionId: text()
      .notNull()
      .references(() => claraLessonSession.id, { onDelete: "cascade" }),
    studentId: text()
      .notNull()
      .references(() => claraStudent.id, { onDelete: "cascade" }),
    status: text().notNull(),
    source: text().notNull().default("teacher"),
    recordedByUserId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    recordedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index("clara_attendance_record_school_id_idx").on(table.schoolId),
    index("clara_attendance_record_lesson_session_id_idx").on(
      table.lessonSessionId,
    ),
    index("clara_attendance_record_student_id_idx").on(table.studentId),
    index("clara_attendance_record_recorded_by_user_id_idx").on(
      table.recordedByUserId,
    ),
    unique("clara_attendance_record_lesson_student_unique").on(
      table.lessonSessionId,
      table.studentId,
    ),
    foreignKey({
      name: "clara_attendance_record_lesson_school_fk",
      columns: [table.lessonSessionId, table.schoolId],
      foreignColumns: [claraLessonSession.id, claraLessonSession.schoolId],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_attendance_record_student_school_fk",
      columns: [table.studentId, table.schoolId],
      foreignColumns: [claraStudent.id, claraStudent.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraPedagogicalEvent = pgTable(
  "clara_pedagogical_event",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("evt")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    lessonSessionId: text()
      .notNull()
      .references(() => claraLessonSession.id, { onDelete: "cascade" }),
    eventType: text().notNull(),
    axisCode: text().notNull(),
    internalCode: text().notNull(),
    severitySuggestion: text().notNull(),
    sensitiveCase: boolean().default(false).notNull(),
    requiresCoordinatorApproval: boolean().default(true).notNull(),
    rawTeacherNote: text().notNull(),
    createdByUserId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reviewStatus: text().notNull().default("awaiting_review"),
    ...timestamps,
  },
  (table) => [
    index("clara_pedagogical_event_school_id_idx").on(table.schoolId),
    index("clara_pedagogical_event_lesson_session_id_idx").on(
      table.lessonSessionId,
    ),
    index("clara_pedagogical_event_created_by_user_id_idx").on(
      table.createdByUserId,
    ),
    index("clara_pedagogical_event_review_status_idx").on(table.reviewStatus),
    unique("clara_pedagogical_event_id_school_unique").on(
      table.id,
      table.schoolId,
    ),
    foreignKey({
      name: "clara_pedagogical_event_lesson_school_fk",
      columns: [table.lessonSessionId, table.schoolId],
      foreignColumns: [claraLessonSession.id, claraLessonSession.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraEventParticipant = pgTable(
  "clara_event_participant",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("ept")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    eventId: text()
      .notNull()
      .references(() => claraPedagogicalEvent.id, { onDelete: "cascade" }),
    studentId: text()
      .notNull()
      .references(() => claraStudent.id, { onDelete: "cascade" }),
    role: text().notNull(),
    hiddenInText: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    index("clara_event_participant_school_id_idx").on(table.schoolId),
    index("clara_event_participant_event_id_idx").on(table.eventId),
    index("clara_event_participant_student_id_idx").on(table.studentId),
    foreignKey({
      name: "clara_event_participant_event_school_fk",
      columns: [table.eventId, table.schoolId],
      foreignColumns: [
        claraPedagogicalEvent.id,
        claraPedagogicalEvent.schoolId,
      ],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_event_participant_student_school_fk",
      columns: [table.studentId, table.schoolId],
      foreignColumns: [claraStudent.id, claraStudent.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraIndividualStudentRecord = pgTable(
  "clara_individual_student_record",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("rec")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    eventId: text()
      .notNull()
      .references(() => claraPedagogicalEvent.id, { onDelete: "cascade" }),
    studentId: text()
      .notNull()
      .references(() => claraStudent.id, { onDelete: "cascade" }),
    rawTeacherNote: text().notNull(),
    normalizedInternalSummary: text().notNull(),
    activesoftObservationDraft: text().notNull(),
    familyMessageDraft: text().notNull(),
    approvedActivesoftObservation: text(),
    approvedFamilyMessage: text(),
    visibilityToFamily: boolean().default(false).notNull(),
    reviewStatus: text().notNull().default("awaiting_review"),
    approvedByUserId: text().references(() => user.id, {
      onDelete: "set null",
    }),
    approvedAt: timestamp({ withTimezone: true, mode: "date" }),
    ...timestamps,
  },
  (table) => [
    index("clara_individual_student_record_school_id_idx").on(table.schoolId),
    index("clara_individual_student_record_event_id_idx").on(table.eventId),
    index("clara_individual_student_record_student_id_idx").on(table.studentId),
    index("clara_individual_student_record_review_status_idx").on(
      table.reviewStatus,
    ),
    index("clara_individual_student_record_approved_by_user_id_idx").on(
      table.approvedByUserId,
    ),
    unique("clara_individual_student_record_event_student_unique").on(
      table.eventId,
      table.studentId,
    ),
    unique("clara_individual_student_record_id_school_unique").on(
      table.id,
      table.schoolId,
    ),
    foreignKey({
      name: "clara_individual_record_event_school_fk",
      columns: [table.eventId, table.schoolId],
      foreignColumns: [
        claraPedagogicalEvent.id,
        claraPedagogicalEvent.schoolId,
      ],
    }).onDelete("cascade"),
    foreignKey({
      name: "clara_individual_record_student_school_fk",
      columns: [table.studentId, table.schoolId],
      foreignColumns: [claraStudent.id, claraStudent.schoolId],
    }).onDelete("cascade"),
  ],
);

export const claraReviewAction = pgTable(
  "clara_review_action",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("rev")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    individualRecordId: text()
      .notNull()
      .references(() => claraIndividualStudentRecord.id, {
        onDelete: "cascade",
      }),
    action: text().notNull(),
    fromStatus: text().notNull(),
    toStatus: text().notNull(),
    note: text(),
    actedByUserId: text().references(() => user.id, {
      onDelete: "set null",
    }),
    actedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    ...timestamps,
  },
  (table) => [
    index("clara_review_action_school_id_idx").on(table.schoolId),
    index("clara_review_action_individual_record_id_idx").on(
      table.individualRecordId,
    ),
    index("clara_review_action_acted_by_user_id_idx").on(table.actedByUserId),
    foreignKey({
      name: "clara_review_action_record_school_fk",
      columns: [table.individualRecordId, table.schoolId],
      foreignColumns: [
        claraIndividualStudentRecord.id,
        claraIndividualStudentRecord.schoolId,
      ],
    }).onDelete("cascade"),
  ],
);

export const claraActivesoftOccurrenceTypeMapping = pgTable(
  "clara_activesoft_occurrence_type_mapping",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("map")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    claraEventType: text().notNull(),
    activesoftOccurrenceTypeId: text().notNull(),
    activesoftOccurrenceTypeName: text().notNull(),
    internetVisibleDefault: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    index("clara_activesoft_mapping_school_id_idx").on(table.schoolId),
    unique("clara_activesoft_mapping_event_type_unique").on(
      table.schoolId,
      table.claraEventType,
    ),
  ],
);

export const claraActivesoftLaunchLog = pgTable(
  "clara_activesoft_launch_log",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("log")),
    schoolId: text()
      .notNull()
      .references(() => claraSchool.id, { onDelete: "cascade" }),
    individualRecordId: text()
      .notNull()
      .references(() => claraIndividualStudentRecord.id, {
        onDelete: "cascade",
      }),
    launchedByUserId: text().references(() => user.id, {
      onDelete: "set null",
    }),
    launchedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    activesoftReference: text(),
    manualConfirmation: boolean().default(true).notNull(),
    internetVisible: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    index("clara_activesoft_launch_log_school_id_idx").on(table.schoolId),
    index("clara_activesoft_launch_log_individual_record_id_idx").on(
      table.individualRecordId,
    ),
    index("clara_activesoft_launch_log_launched_by_user_id_idx").on(
      table.launchedByUserId,
    ),
    foreignKey({
      name: "clara_activesoft_launch_record_school_fk",
      columns: [table.individualRecordId, table.schoolId],
      foreignColumns: [
        claraIndividualStudentRecord.id,
        claraIndividualStudentRecord.schoolId,
      ],
    }).onDelete("cascade"),
  ],
);

export const claraSchoolRelations = relations(claraSchool, ({ one, many }) => ({
  organization: one(organization, {
    fields: [claraSchool.organizationId],
    references: [organization.id],
  }),
  terms: many(claraTerm),
  subjects: many(claraSubject),
  classes: many(claraClass),
  students: many(claraStudent),
}));

export const claraLessonSessionRelations = relations(
  claraLessonSession,
  ({ one, many }) => ({
    school: one(claraSchool, {
      fields: [claraLessonSession.schoolId],
      references: [claraSchool.id],
    }),
    class: one(claraClass, {
      fields: [claraLessonSession.classId],
      references: [claraClass.id],
    }),
    subject: one(claraSubject, {
      fields: [claraLessonSession.subjectId],
      references: [claraSubject.id],
    }),
    teacherProfile: one(claraTeacherProfile, {
      fields: [claraLessonSession.teacherProfileId],
      references: [claraTeacherProfile.id],
    }),
    attendanceRecords: many(claraAttendanceRecord),
    pedagogicalEvents: many(claraPedagogicalEvent),
  }),
);

export const claraIndividualStudentRecordRelations = relations(
  claraIndividualStudentRecord,
  ({ one, many }) => ({
    school: one(claraSchool, {
      fields: [claraIndividualStudentRecord.schoolId],
      references: [claraSchool.id],
    }),
    event: one(claraPedagogicalEvent, {
      fields: [claraIndividualStudentRecord.eventId],
      references: [claraPedagogicalEvent.id],
    }),
    student: one(claraStudent, {
      fields: [claraIndividualStudentRecord.studentId],
      references: [claraStudent.id],
    }),
    reviewActions: many(claraReviewAction),
    launchLogs: many(claraActivesoftLaunchLog),
  }),
);
