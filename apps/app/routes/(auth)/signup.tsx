import { AuthForm } from "@/components/auth";
import { getSafeRedirectUrl } from "@/lib/auth-config";
import { invalidateSession, sessionQueryOptions } from "@/lib/queries/session";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  isRedirect,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { z } from "zod";

// Sanitize returnTo at parse time - consumers get a safe value or undefined
const searchSchema = z.object({
  returnTo: z
    .string()
    .optional()
    .transform((val) => {
      const safe = getSafeRedirectUrl(val);
      return safe === "/" ? undefined : safe;
    })
    .catch(undefined),
});

export const Route = createFileRoute("/(auth)/signup")({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, search }) => {
    try {
      const session = await context.queryClient.fetchQuery(
        sessionQueryOptions(),
      );

      // Redirect authenticated users to their destination
      if (session?.user && session?.session) {
        throw redirect({ to: search.returnTo ?? "/" });
      }
    } catch (error) {
      // Re-throw redirects, show signup form for fetch errors
      if (isRedirect(error)) throw error;
    }
  },
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  async function handleSuccess() {
    // Fetch fresh session into cache, then invalidate to trigger re-renders
    await queryClient.fetchQuery(sessionQueryOptions());
    await invalidateSession(queryClient);
    await router.invalidate();
    await router.navigate({ to: search.returnTo ?? "/" });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-sm ring-1 ring-border/50">
        <AuthForm variant="signup" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
