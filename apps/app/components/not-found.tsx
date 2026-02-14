import { Button } from "@repo/ui";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
