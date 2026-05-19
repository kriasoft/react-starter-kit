export type ClaraEnrolledStudent = {
  id: string;
  displayName: string;
};

export function getDuplicateStudentIds(studentIds: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const studentId of studentIds) {
    if (seen.has(studentId)) {
      duplicates.add(studentId);
    } else {
      seen.add(studentId);
    }
  }

  return Array.from(duplicates);
}

export function getMissingEnrolledStudentIds(
  requestedStudentIds: string[],
  enrolledStudents: ClaraEnrolledStudent[],
) {
  const enrolledIds = new Set(enrolledStudents.map((student) => student.id));

  return requestedStudentIds.filter((studentId) => !enrolledIds.has(studentId));
}

export function selectEnrolledStudentsById(
  requestedStudentIds: string[],
  enrolledStudents: ClaraEnrolledStudent[],
) {
  const enrolledById = new Map(
    enrolledStudents.map((student) => [student.id, student]),
  );

  return requestedStudentIds.flatMap((studentId) => {
    const student = enrolledById.get(studentId);
    return student ? [student] : [];
  });
}
