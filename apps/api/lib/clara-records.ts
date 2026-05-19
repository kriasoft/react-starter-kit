export const CLARA_REVIEW_STATUS = {
  awaitingReview: "awaiting_review",
  approvedForActivesoft: "approved_for_activesoft",
  launchedInActivesoft: "launched_in_activesoft",
  releasedToFamily: "released_to_family",
  returned: "returned",
  archived: "archived",
} as const;

export type ClaraReviewStatus =
  (typeof CLARA_REVIEW_STATUS)[keyof typeof CLARA_REVIEW_STATUS];

export type ClaraStudentRef = {
  id: string;
  displayName: string;
};

export type ClaraEventDraft = {
  schoolId: string;
  lessonSessionId: string;
  eventType: string;
  axisCode: string;
  internalCode: string;
  severitySuggestion: string;
  sensitiveCase: boolean;
  requiresCoordinatorApproval: boolean;
  rawTeacherNote: string;
  createdByUserId: string;
  reviewStatus: ClaraReviewStatus;
};

export type ClaraEventParticipantDraft = {
  studentId: string;
  role: "registered_student" | "involved" | "witness" | "hidden_in_text";
  hiddenInText: boolean;
};

export type ClaraIndividualRecordDraft = {
  studentId: string;
  studentDisplayName: string;
  rawTeacherNote: string;
  normalizedInternalSummary: string;
  activesoftObservationDraft: string;
  familyMessageDraft: string;
  visibilityToFamily: boolean;
  reviewStatus: ClaraReviewStatus;
};

export type ClaraRecordGenerationResult = {
  event: ClaraEventDraft;
  participants: ClaraEventParticipantDraft[];
  records: ClaraIndividualRecordDraft[];
};

export function buildMissingHomeworkEventDraft(input: {
  schoolId: string;
  lessonSessionId: string;
  createdByUserId: string;
  className: string;
  subjectName: string;
  selectedStudents: ClaraStudentRef[];
}): ClaraRecordGenerationResult {
  const rawTeacherNote = `Tarefa nao realizada em ${input.subjectName} na turma ${input.className}.`;

  return {
    event: {
      schoolId: input.schoolId,
      lessonSessionId: input.lessonSessionId,
      eventType: "homework_missing",
      axisCode: "A",
      internalCode: "A1",
      severitySuggestion: "low",
      sensitiveCase: false,
      requiresCoordinatorApproval: false,
      rawTeacherNote,
      createdByUserId: input.createdByUserId,
      reviewStatus: CLARA_REVIEW_STATUS.awaitingReview,
    },
    participants: input.selectedStudents.map((student) => ({
      studentId: student.id,
      role: "registered_student",
      hiddenInText: false,
    })),
    records: input.selectedStudents.map((student) => ({
      studentId: student.id,
      studentDisplayName: student.displayName,
      rawTeacherNote,
      normalizedInternalSummary:
        "Registro de acompanhamento pedagogico por tarefa de casa nao apresentada.",
      activesoftObservationDraft:
        "O estudante nao apresentou a atividade de casa solicitada para a aula. O registro tem finalidade de acompanhamento pedagogico da rotina de estudos.",
      familyMessageDraft:
        "A atividade de casa solicitada nao foi apresentada. A escola seguira acompanhando a rotina de estudos.",
      visibilityToFamily: false,
      reviewStatus: CLARA_REVIEW_STATUS.awaitingReview,
    })),
  };
}

export function buildSensitiveEventDraft(input: {
  schoolId: string;
  lessonSessionId: string;
  createdByUserId: string;
  student: ClaraStudentRef;
  eventType: string;
  rawTeacherNote: string;
}): ClaraRecordGenerationResult {
  return {
    event: {
      schoolId: input.schoolId,
      lessonSessionId: input.lessonSessionId,
      eventType: input.eventType,
      axisCode: "C",
      internalCode: "C1",
      severitySuggestion: "medium",
      sensitiveCase: true,
      requiresCoordinatorApproval: true,
      rawTeacherNote: input.rawTeacherNote,
      createdByUserId: input.createdByUserId,
      reviewStatus: CLARA_REVIEW_STATUS.awaitingReview,
    },
    participants: [
      {
        studentId: input.student.id,
        role: "registered_student",
        hiddenInText: false,
      },
    ],
    records: [
      {
        studentId: input.student.id,
        studentDisplayName: input.student.displayName,
        rawTeacherNote: input.rawTeacherNote,
        normalizedInternalSummary:
          "Registro sensivel pendente de revisao da coordenacao.",
        activesoftObservationDraft:
          "Durante a atividade em sala, houve situacao que exigiu intervencao pedagogica. O caso foi encaminhado a coordenacao para acompanhamento.",
        familyMessageDraft:
          "A coordenacao avaliara o registro antes de qualquer comunicacao externa.",
        visibilityToFamily: false,
        reviewStatus: CLARA_REVIEW_STATUS.awaitingReview,
      },
    ],
  };
}
