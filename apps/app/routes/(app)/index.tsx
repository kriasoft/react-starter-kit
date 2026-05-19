import { trpcClient } from "@/lib/trpc";
import { formatLocalDateKey } from "@/lib/dates";
import { getErrorMessage } from "@/lib/errors";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Textarea,
} from "@repo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/(app)/")({
  component: ClaraDashboard,
});

type TodayData = Awaited<
  ReturnType<typeof trpcClient.clara.teacher.today.query>
>;
type Lesson = TodayData["lessons"][number];
type Student = Lesson["students"][number];
type AttendanceStatus =
  | "present"
  | "absent"
  | "excused_absence"
  | "late"
  | "early_departure"
  | "not_informed";
type ReviewItem = Awaited<
  ReturnType<typeof trpcClient.clara.coordination.reviewQueue.query>
>[number];

const claraQueryKey = ["clara"] as const;

function ClaraDashboard() {
  const queryClient = useQueryClient();
  const today = useMemo(() => formatLocalDateKey(new Date()), []);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [attendanceByLesson, setAttendanceByLesson] = useState<
    Record<string, Record<string, AttendanceStatus>>
  >({});
  const [missingHomeworkByLesson, setMissingHomeworkByLesson] = useState<
    Record<string, Set<string>>
  >({});
  const [reviewTextById, setReviewTextById] = useState<Record<string, string>>(
    {},
  );
  const [mutationError, setMutationError] = useState<string | null>(null);

  const todayQuery = useQuery({
    queryKey: [...claraQueryKey, "teacher", "today", today],
    queryFn: () => trpcClient.clara.teacher.today.query({ date: today }),
  });
  const reviewQueueQuery = useQuery({
    queryKey: [...claraQueryKey, "coordination", "reviewQueue"],
    queryFn: () => trpcClient.clara.coordination.reviewQueue.query(),
    retry: false,
  });
  const activeSoftProbeQuery = useQuery({
    queryKey: [...claraQueryKey, "integration", "activesoftProbe"],
    queryFn: () => trpcClient.clara.integration.activesoftProbe.query(),
  });

  const selectedLesson =
    todayQuery.data?.lessons.find((lesson) => lesson.id === selectedLessonId) ??
    todayQuery.data?.lessons[0];
  const effectiveSelectedLessonId = selectedLesson?.id ?? null;
  const attendance = useMemo(() => {
    if (!selectedLesson) return {};
    return (
      attendanceByLesson[selectedLesson.id] ??
      getInitialAttendanceForLesson(selectedLesson)
    );
  }, [attendanceByLesson, selectedLesson]);
  const missingHomework = useMemo(() => {
    if (!selectedLesson) return new Set<string>();
    return missingHomeworkByLesson[selectedLesson.id] ?? new Set<string>();
  }, [missingHomeworkByLesson, selectedLesson]);

  const refreshClara = async () => {
    await queryClient.invalidateQueries({ queryKey: claraQueryKey });
  };
  const handleMutationError = (error: unknown) => {
    setMutationError(getErrorMessage(error));
  };

  const startLessonMutation = useMutation({
    mutationFn: (lessonSessionId: string) =>
      trpcClient.clara.teacher.startLesson.mutate({ lessonSessionId }),
    onError: handleMutationError,
    onSuccess: async () => {
      setMutationError(null);
      await refreshClara();
    },
  });
  const recordAttendanceMutation = useMutation({
    mutationFn: (input: {
      lessonSessionId: string;
      records: { studentId: string; status: AttendanceStatus }[];
    }) => trpcClient.clara.teacher.recordAttendance.mutate(input),
    onError: handleMutationError,
    onSuccess: async () => {
      setMutationError(null);
      await refreshClara();
    },
  });
  const homeworkMutation = useMutation({
    mutationFn: (input: { lessonSessionId: string; studentIds: string[] }) =>
      trpcClient.clara.teacher.recordMissingHomework.mutate(input),
    onError: handleMutationError,
    onSuccess: async (_data, variables) => {
      setMutationError(null);
      setMissingHomeworkByLesson((current) => {
        const next = { ...current };
        delete next[variables.lessonSessionId];
        return next;
      });
      await refreshClara();
    },
  });
  const approveMutation = useMutation({
    mutationFn: (input: {
      recordId: string;
      approvedActivesoftObservation: string;
      visibilityToFamily: boolean;
    }) => trpcClient.clara.coordination.approveRecord.mutate(input),
    onError: handleMutationError,
    onSuccess: async () => {
      setMutationError(null);
      await refreshClara();
    },
  });
  const launchMutation = useMutation({
    mutationFn: (recordId: string) =>
      trpcClient.clara.coordination.logActivesoftLaunch.mutate({
        recordId,
        internetVisible: false,
      }),
    onError: handleMutationError,
    onSuccess: async () => {
      setMutationError(null);
      await refreshClara();
    },
  });

  const markAllPresent = () => {
    if (!selectedLesson) return;

    setAttendance(
      selectedLesson.id,
      Object.fromEntries(
        selectedLesson.students.map((student) => [student.id, "present"]),
      ),
    );
  };

  const saveAttendance = () => {
    if (!selectedLesson) return;

    recordAttendanceMutation.mutate({
      lessonSessionId: selectedLesson.id,
      records: selectedLesson.students.map((student) => ({
        studentId: student.id,
        status: attendance[student.id] ?? "not_informed",
      })),
    });
  };

  const saveHomework = () => {
    if (!selectedLesson || missingHomework.size === 0) return;

    homeworkMutation.mutate({
      lessonSessionId: selectedLesson.id,
      studentIds: Array.from(missingHomework),
    });
  };

  if (todayQuery.data?.setupRequired) {
    return (
      <main className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Clara precisa do cadastro escolar</CardTitle>
            <CardDescription>
              Vincule uma escola, turmas, professoras, estudantes e aulas ao
              tenant ativo antes do modo aula.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modo aula</h1>
          <p className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "full",
            }).format(new Date(`${today}T00:00:00`))}
          </p>
        </div>
        <ActiveSoftStatus probe={activeSoftProbeQuery.data} />
      </section>
      {mutationError ? (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{mutationError}</p>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
        <LessonList
          isLoading={todayQuery.isLoading}
          lessons={todayQuery.data?.lessons ?? []}
          selectedLessonId={effectiveSelectedLessonId}
          onSelect={setSelectedLessonId}
          onStart={(lessonId) => startLessonMutation.mutate(lessonId)}
          isStarting={startLessonMutation.isPending}
        />

        <ClassWorkflow
          lesson={selectedLesson}
          attendance={attendance}
          missingHomework={missingHomework}
          onAttendanceChange={(studentId, status) => {
            if (!selectedLesson) return;
            setAttendance(selectedLesson.id, {
              ...attendance,
              [studentId]: status,
            });
          }}
          onHomeworkToggle={(studentId) =>
            setMissingHomeworkByLesson((current) => {
              if (!selectedLesson) return current;
              const currentLessonSelection =
                current[selectedLesson.id] ?? new Set<string>();
              const nextSelection = new Set(currentLessonSelection);
              if (nextSelection.has(studentId)) {
                nextSelection.delete(studentId);
              } else {
                nextSelection.add(studentId);
              }

              return {
                ...current,
                [selectedLesson.id]: nextSelection,
              };
            })
          }
          onMarkAllPresent={markAllPresent}
          onSaveAttendance={saveAttendance}
          onSaveHomework={saveHomework}
          attendancePending={recordAttendanceMutation.isPending}
          homeworkPending={homeworkMutation.isPending}
        />
      </section>

      <CoordinationQueue
        items={reviewQueueQuery.data ?? []}
        blocked={!reviewQueueQuery.data && reviewQueueQuery.isError}
        reviewTextById={reviewTextById}
        onTextChange={(recordId, value) =>
          setReviewTextById((current) => ({ ...current, [recordId]: value }))
        }
        onApprove={(item) => {
          approveMutation.mutate({
            recordId: item.id,
            approvedActivesoftObservation:
              reviewTextById[item.id]?.trim() ||
              item.approvedActivesoftObservation ||
              item.activesoftObservationDraft,
            visibilityToFamily: false,
          });
        }}
        onLaunch={(recordId) => launchMutation.mutate(recordId)}
        approvingId={
          approveMutation.isPending
            ? approveMutation.variables?.recordId
            : undefined
        }
        launchingId={
          launchMutation.isPending ? launchMutation.variables : undefined
        }
      />
    </main>
  );

  function setAttendance(
    lessonSessionId: string,
    nextAttendance: Record<string, AttendanceStatus>,
  ) {
    setAttendanceByLesson((current) => ({
      ...current,
      [lessonSessionId]: nextAttendance,
    }));
  }
}

function getInitialAttendanceForLesson(lesson: Lesson) {
  return Object.fromEntries(
    lesson.students.map((student) => [
      student.id,
      student.attendanceStatus as AttendanceStatus,
    ]),
  );
}

function ActiveSoftStatus(props: {
  probe:
    | Awaited<
        ReturnType<typeof trpcClient.clara.integration.activesoftProbe.query>
      >
    | undefined;
}) {
  const summary = props.probe?.summary;

  return (
    <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
      {summary?.configured ? (
        <ShieldCheck className="h-4 w-4 text-green-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      )}
      <span className="font-medium">
        ActiveSoft {summary?.configured ? "configurado" : "sem credencial"}
      </span>
      {summary?.host ? (
        <span className="text-muted-foreground">{summary.host}</span>
      ) : null}
    </div>
  );
}

function LessonList(props: {
  isLoading: boolean;
  lessons: Lesson[];
  selectedLessonId: string | null;
  isStarting: boolean;
  onSelect: (lessonId: string) => void;
  onStart: (lessonId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5" />
          Aulas de hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {props.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : null}
        {!props.isLoading && props.lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma aula encontrada para hoje.
          </p>
        ) : null}
        {props.lessons.map((lesson) => (
          <button
            key={lesson.id}
            type="button"
            onClick={() => props.onSelect(lesson.id)}
            className={`w-full rounded-md border p-3 text-left transition-colors ${
              props.selectedLessonId === lesson.id
                ? "border-primary bg-primary/5"
                : "hover:bg-accent"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">
                  {lesson.startsAt} - {lesson.className}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lesson.subjectName}
                </p>
              </div>
              <span className="rounded-md border px-2 py-1 text-xs">
                {lesson.status}
              </span>
            </div>
            {lesson.status === "scheduled" ? (
              <Button
                type="button"
                size="sm"
                className="mt-3"
                disabled={props.isStarting}
                onClick={(event) => {
                  event.stopPropagation();
                  props.onStart(lesson.id);
                }}
              >
                Iniciar aula
              </Button>
            ) : null}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function ClassWorkflow(props: {
  lesson: Lesson | undefined;
  attendance: Record<string, AttendanceStatus>;
  missingHomework: Set<string>;
  attendancePending: boolean;
  homeworkPending: boolean;
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void;
  onHomeworkToggle: (studentId: string) => void;
  onMarkAllPresent: () => void;
  onSaveAttendance: () => void;
  onSaveHomework: () => void;
}) {
  if (!props.lesson) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selecione uma aula</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chamada
          </CardTitle>
          <CardDescription>
            {props.lesson.className} - {props.lesson.subjectName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={props.onMarkAllPresent}
            >
              <CheckCircle2 className="h-4 w-4" />
              Todos presentes
            </Button>
            <Button
              type="button"
              onClick={props.onSaveAttendance}
              disabled={
                props.attendancePending || props.lesson.students.length === 0
              }
            >
              Salvar chamada
            </Button>
          </div>
          <div className="grid gap-2">
            {props.lesson.students.map((student) => (
              <AttendanceRow
                key={student.id}
                student={student}
                status={props.attendance[student.id] ?? "not_informed"}
                onChange={(status) =>
                  props.onAttendanceChange(student.id, status)
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Tarefa de casa
          </CardTitle>
          <CardDescription>
            {props.missingHomework.size} estudante
            {props.missingHomework.size === 1 ? "" : "s"} selecionado
            {props.missingHomework.size === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {props.lesson.students.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <Checkbox
                  checked={props.missingHomework.has(student.id)}
                  onCheckedChange={() => props.onHomeworkToggle(student.id)}
                />
                <span className="text-sm font-medium">
                  {student.displayName}
                </span>
              </label>
            ))}
          </div>
          <Button
            type="button"
            onClick={props.onSaveHomework}
            disabled={props.homeworkPending || props.missingHomework.size === 0}
          >
            Registrar tarefa não apresentada
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceRow(props: {
  student: Student;
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border p-3">
      <span className="text-sm font-medium">{props.student.displayName}</span>
      <select
        aria-label={`Chamada de ${props.student.displayName}`}
        value={props.status}
        onChange={(event) =>
          props.onChange(event.target.value as AttendanceStatus)
        }
        className="h-9 rounded-md border bg-background px-2 text-sm"
      >
        <option value="present">Presente</option>
        <option value="absent">Ausente</option>
        <option value="excused_absence">Falta justificada</option>
        <option value="late">Atraso</option>
        <option value="early_departure">Saida antecipada</option>
        <option value="not_informed">Nao informado</option>
      </select>
    </div>
  );
}

function CoordinationQueue(props: {
  items: ReviewItem[];
  blocked: boolean;
  reviewTextById: Record<string, string>;
  approvingId: string | undefined;
  launchingId: string | undefined;
  onTextChange: (recordId: string, value: string) => void;
  onApprove: (item: ReviewItem) => void;
  onLaunch: (recordId: string) => void;
}) {
  if (props.blocked) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Revisão da coordenação</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {props.items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhum registro aguardando revisão.
            </CardContent>
          </Card>
        ) : null}
        {props.items.map((item) => {
          const approvedText =
            props.reviewTextById[item.id] ??
            item.approvedActivesoftObservation ??
            item.activesoftObservationDraft;
          const canApprove = item.reviewStatus === "awaiting_review";
          const canLaunch = item.reviewStatus === "approved_for_activesoft";

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.studentName}</CardTitle>
                <CardDescription>
                  {item.className} - {item.subjectName} - {item.eventType}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md border px-2 py-1">
                    {item.reviewStatus}
                  </span>
                  {item.sensitiveCase ? (
                    <span className="rounded-md border border-amber-300 px-2 py-1 text-amber-700">
                      Sensível
                    </span>
                  ) : null}
                  <span className="rounded-md border px-2 py-1">
                    Família: {item.visibilityToFamily ? "sim" : "não"}
                  </span>
                </div>
                <Textarea
                  value={approvedText}
                  disabled={!canApprove}
                  onChange={(event) =>
                    props.onTextChange(item.id, event.target.value)
                  }
                  rows={4}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => props.onApprove(item)}
                    disabled={!canApprove || props.approvingId === item.id}
                  >
                    Aprovar ActiveSoft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!canLaunch || props.launchingId === item.id}
                    onClick={() => props.onLaunch(item.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Registrar lançamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
