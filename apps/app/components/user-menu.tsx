import { signOut, useSessionQuery } from "@/lib/queries/session";
import { Avatar, AvatarFallback, Button } from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, RefreshCw, User } from "lucide-react";

/**
 * Example component showing how to use session query
 * with loading states and error handling
 */
export function UserMenu() {
  const queryClient = useQueryClient();
  const { data: session, isPending, error, refetch } = useSessionQuery();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 text-sm text-destructive">
        Failed to load session
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="ml-2"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      </div>
    );
  }

  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut(queryClient)}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
