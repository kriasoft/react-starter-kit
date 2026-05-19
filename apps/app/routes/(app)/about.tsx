import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/about")({
  component: About,
});

function About() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Clara</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Clara is a guided classroom routine assistant for fast attendance,
          homework follow-up, pedagogical occurrence capture, and coordination
          review before any record is launched in ActiveSoft.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Classroom First</CardTitle>
            <CardDescription>
              Designed around the teacher's live class routine.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Start with today's classes, mark attendance quickly, and capture
            objective homework or material records without turning the tool into
            a long form.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Gate</CardTitle>
            <CardDescription>
              Coordination controls what becomes official.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Raw text, audio, and sensitive notes stay internal until reviewed.
            ActiveSoft and family-facing text are separate approved outputs.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ActiveSoft Boundary</CardTitle>
            <CardDescription>
              ActiveSoft remains the official system.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The MVP starts with assisted launch. Automatic sync only happens
            after the school confirms official API permissions and test payloads.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
