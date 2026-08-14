import {
  useCreateOrganization,
  useMembersQuery,
} from "@/lib/queries/organization";
import { useSessionQuery } from "@/lib/queries/session";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useId, useState } from "react";

export const Route = createFileRoute("/(app)/members")({
  component: Members,
});

function Members() {
  const { data: session } = useSessionQuery();
  const activeOrgId = session?.session?.activeOrganizationId;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Members</h2>
        <p className="text-muted-foreground">
          People with access to your active organization.
        </p>
      </div>

      {activeOrgId ? (
        <MemberList organizationId={activeOrgId} />
      ) : (
        <CreateOrganizationCard />
      )}
    </div>
  );
}

function MemberList({ organizationId }: { organizationId: string }) {
  const { data, isPending, error } = useMembersQuery(organizationId);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading members...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Could not load members: {error.message}
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>
          {memberCount(data.members.length, data.total)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {data.members.map(({ id, role, user }) => {
            const displayName = user.name || user.email;

            return (
              <li key={id} className="flex items-center gap-4 py-3">
                <Avatar>
                  <AvatarFallback>
                    {displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <span className="text-xs capitalize text-muted-foreground">
                  {role}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

/**
 * Sign-up does not create an organization, so this is the entry point into the
 * multi-tenant layer. Inviting others needs `sendInvitationEmail` wired up on
 * the organization plugin – see the Organizations & Roles guide.
 */
function CreateOrganizationCard() {
  const [name, setName] = useState("");
  const nameId = useId();
  const errorId = useId();
  const createOrganization = useCreateOrganization();
  const error = createOrganization.error;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <CardTitle>No active organization</CardTitle>
        </div>
        <CardDescription>
          Create one to group members and scope tenant data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3 sm:max-w-sm"
          onSubmit={(event) => {
            event.preventDefault();
            createOrganization.mutate(name.trim());
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor={nameId}>Organization name</Label>
            <Input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Acme Inc"
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          {/* The failure arrives after submit, so it needs announcing. */}
          {error && (
            <p id={errorId} role="alert" className="text-sm text-destructive">
              {error.message}
            </p>
          )}
          <Button
            type="submit"
            className="self-start"
            disabled={createOrganization.isPending || name.trim() === ""}
          >
            {createOrganization.isPending
              ? "Creating..."
              : "Create organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/** The query fetches one page, so say so rather than a count the list can't back up. */
function memberCount(shown: number, total: number): string {
  if (shown < total) return `Showing ${shown} of ${total}`;
  return `${total} member${total === 1 ? "" : "s"}`;
}
