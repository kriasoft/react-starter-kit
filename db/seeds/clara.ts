import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../schema";
import {
  claraActivesoftOccurrenceTypeMapping,
  claraClass,
  claraEnrollment,
  claraLessonSession,
  claraSchool,
  claraStudent,
  claraSubject,
  claraTeacherAssignment,
  claraTeacherProfile,
  claraTerm,
  member,
  organization,
  user,
} from "../schema";

const demo = {
  organizationId: "org_clara_demo",
  schoolId: "sch_clara_demo",
  termId: "trm_clara_2026",
  subjectId: "sub_clara_math",
  classId: "cls_clara_6a",
  teacherUserId: "usr_clara_teacher",
  coordinatorUserId: "usr_clara_coord",
  teacherProfileId: "tpr_clara_teacher",
  assignmentId: "asg_clara_math_6a",
  lessonSessionId: "les_clara_today_math_6a",
} as const;

const students = [
  { id: "stu_clara_ana", displayName: "Ana Clara" },
  { id: "stu_clara_bruno", displayName: "Bruno" },
  { id: "stu_clara_caio", displayName: "Caio" },
  { id: "stu_clara_davi", displayName: "Davi" },
  { id: "stu_clara_elisa", displayName: "Elisa" },
] as const;

export async function seedClaraDemo(db: PostgresJsDatabase<typeof schema>) {
  console.log("Seeding Clara demo classroom...");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await db
    .insert(user)
    .values([
      {
        id: demo.teacherUserId,
        name: "Ana Professora",
        email: "ana.professora@example.com",
        emailVerified: true,
      },
      {
        id: demo.coordinatorUserId,
        name: "Carla Coordenacao",
        email: "carla.coordenacao@example.com",
        emailVerified: true,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(organization)
    .values({
      id: demo.organizationId,
      name: "Escola Clara Demo",
      slug: "clara-demo",
    })
    .onConflictDoNothing();

  await db
    .insert(member)
    .values([
      {
        id: "mem_clara_teacher",
        userId: demo.teacherUserId,
        organizationId: demo.organizationId,
        role: "member",
      },
      {
        id: "mem_clara_coord",
        userId: demo.coordinatorUserId,
        organizationId: demo.organizationId,
        role: "admin",
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(claraSchool)
    .values({
      id: demo.schoolId,
      organizationId: demo.organizationId,
      name: "Escola Clara Demo",
      activesoftSchoolId: "demo-school",
    })
    .onConflictDoNothing();

  await db
    .insert(claraTerm)
    .values({
      id: demo.termId,
      schoolId: demo.schoolId,
      name: "Ano letivo 2026",
      startsOn: new Date("2026-01-01T00:00:00.000Z"),
      endsOn: new Date("2026-12-31T00:00:00.000Z"),
      status: "active",
    })
    .onConflictDoNothing();

  await db
    .insert(claraSubject)
    .values({
      id: demo.subjectId,
      schoolId: demo.schoolId,
      name: "Matematica",
      code: "MAT",
    })
    .onConflictDoNothing();

  await db
    .insert(claraClass)
    .values({
      id: demo.classId,
      schoolId: demo.schoolId,
      termId: demo.termId,
      name: "6A",
      grade: "6",
      shift: "morning",
      activesoftClassId: "demo-6a",
    })
    .onConflictDoNothing();

  await db
    .insert(claraTeacherProfile)
    .values({
      id: demo.teacherProfileId,
      schoolId: demo.schoolId,
      userId: demo.teacherUserId,
      displayName: "Ana Professora",
      activesoftTeacherId: "demo-teacher-ana",
    })
    .onConflictDoNothing();

  await db
    .insert(claraTeacherAssignment)
    .values({
      id: demo.assignmentId,
      schoolId: demo.schoolId,
      teacherProfileId: demo.teacherProfileId,
      classId: demo.classId,
      subjectId: demo.subjectId,
    })
    .onConflictDoNothing();

  for (const student of students) {
    await db
      .insert(claraStudent)
      .values({
        id: student.id,
        schoolId: demo.schoolId,
        displayName: student.displayName,
        activesoftStudentId: student.id.replace("stu_clara_", "demo-"),
        status: "active",
      })
      .onConflictDoNothing();

    await db
      .insert(claraEnrollment)
      .values({
        id: `enr_${student.id.replace("stu_clara_", "clara_")}`,
        schoolId: demo.schoolId,
        classId: demo.classId,
        studentId: student.id,
        status: "active",
      })
      .onConflictDoNothing();
  }

  await db
    .insert(claraLessonSession)
    .values({
      id: demo.lessonSessionId,
      schoolId: demo.schoolId,
      classId: demo.classId,
      subjectId: demo.subjectId,
      teacherProfileId: demo.teacherProfileId,
      scheduledDate: today,
      startsAt: "07:30",
      endsAt: "08:20",
      status: "scheduled",
    })
    .onConflictDoUpdate({
      target: claraLessonSession.id,
      set: {
        scheduledDate: today,
        startsAt: "07:30",
        endsAt: "08:20",
        updatedAt: new Date(),
      },
    });

  await db
    .insert(claraActivesoftOccurrenceTypeMapping)
    .values({
      id: "map_clara_homework",
      schoolId: demo.schoolId,
      claraEventType: "homework_missing",
      activesoftOccurrenceTypeId: "demo-homework",
      activesoftOccurrenceTypeName: "Tarefa nao realizada",
      internetVisibleDefault: false,
    })
    .onConflictDoNothing();

  console.log("✅ Seeded Clara demo classroom");
}
