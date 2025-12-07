import { LoginForm } from "@/components/auth/login-form";
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

export const Route = createFileRoute("/(auth)/login")({
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
      // Re-throw redirects, show login form for fetch errors
      if (isRedirect(error)) throw error;
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  async function handleSuccess() {
    await invalidateSession(queryClient);
    await router.invalidate();
    await router.navigate({ to: search.returnTo ?? "/" });
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
