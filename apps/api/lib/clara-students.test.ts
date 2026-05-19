import { describe, expect, it } from "vitest";
import {
  getDuplicateStudentIds,
  getMissingEnrolledStudentIds,
  selectEnrolledStudentsById,
} from "./clara-students.js";

const enrolledStudents = [
  { id: "stu_ana", displayName: "Ana" },
  { id: "stu_bruno", displayName: "Bruno" },
  { id: "stu_caio", displayName: "Caio" },
];

describe("Clara student enrollment validation", () => {
  it("detects duplicate requested student ids", () => {
    expect(
      getDuplicateStudentIds(["stu_ana", "stu_bruno", "stu_ana", "stu_bruno"]),
    ).toEqual(["stu_ana", "stu_bruno"]);
  });

  it("detects requested students that are not enrolled in the class", () => {
    expect(
      getMissingEnrolledStudentIds(
        ["stu_ana", "stu_not_in_class", "stu_caio"],
        enrolledStudents,
      ),
    ).toEqual(["stu_not_in_class"]);
  });

  it("selects enrolled students in request order", () => {
    expect(
      selectEnrolledStudentsById(["stu_caio", "stu_ana"], enrolledStudents),
    ).toEqual([
      { id: "stu_caio", displayName: "Caio" },
      { id: "stu_ana", displayName: "Ana" },
    ]);
  });
});
