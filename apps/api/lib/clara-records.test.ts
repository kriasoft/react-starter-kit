import { describe, expect, it } from "vitest";
import {
  buildMissingHomeworkEventDraft,
  buildSensitiveEventDraft,
} from "./clara-records.js";

describe("Clara record draft generation", () => {
  it("creates one homework record per selected student without leaking peer names", () => {
    const result = buildMissingHomeworkEventDraft({
      schoolId: "sch_demo",
      lessonSessionId: "les_demo",
      createdByUserId: "usr_teacher",
      className: "6A",
      subjectName: "Matematica",
      selectedStudents: [
        { id: "stu_bruno", displayName: "Bruno" },
        { id: "stu_davi", displayName: "Davi" },
        { id: "stu_elisa", displayName: "Elisa" },
      ],
    });

    expect(result.event).toMatchObject({
      eventType: "homework_missing",
      axisCode: "A",
      internalCode: "A1",
      reviewStatus: "awaiting_review",
      sensitiveCase: false,
      requiresCoordinatorApproval: false,
    });
    expect(result.participants).toHaveLength(3);
    expect(result.records).toHaveLength(3);

    for (const record of result.records) {
      const peerNames = ["Bruno", "Davi", "Elisa"].filter(
        (name) => name !== record.studentDisplayName,
      );

      expect(record.visibilityToFamily).toBe(false);
      expect(record.reviewStatus).toBe("awaiting_review");
      expect(record.activesoftObservationDraft).toContain(
        "nao apresentou a atividade de casa",
      );
      for (const peerName of peerNames) {
        expect(record.activesoftObservationDraft).not.toContain(peerName);
        expect(record.familyMessageDraft).not.toContain(peerName);
      }
    }
  });

  it("routes sensitive events to mandatory coordination review and blocks family visibility", () => {
    const result = buildSensitiveEventDraft({
      schoolId: "sch_demo",
      lessonSessionId: "les_demo",
      createdByUserId: "usr_teacher",
      student: { id: "stu_caio", displayName: "Caio" },
      eventType: "conflict_with_peer",
      rawTeacherNote: "Aluno discutiu com colega durante a atividade.",
    });

    expect(result.event).toMatchObject({
      eventType: "conflict_with_peer",
      reviewStatus: "awaiting_review",
      sensitiveCase: true,
      requiresCoordinatorApproval: true,
    });
    expect(result.records[0]).toMatchObject({
      studentId: "stu_caio",
      visibilityToFamily: false,
      reviewStatus: "awaiting_review",
    });
    expect(result.records[0].activesoftObservationDraft).toContain(
      "encaminhado a coordenacao",
    );
  });
});
