import { auth } from "@/lib/auth";
import { useBillingQuery } from "@/lib/queries/billing";
import { useSessionQuery } from "@/lib/queries/session";
import { type ThemePreference, useTheme } from "@/lib/theme";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/ui";
import { useId } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  type LucideIcon,
  Monitor,
  Moon,
  Palette,
  Sun,
} from "lucide-react";

export const Route = createFileRoute("/(app)/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage billing and appearance.</p>
      </div>

      <div className="grid gap-6">
        <BillingCard />

        <AppearanceCard />
      </div>
    </div>
  );
}

function BillingCard() {
  const { data: session } = useSessionQuery();
  const activeOrgId = session?.session?.activeOrganizationId;
  const { data: billing, isLoading } = useBillingQuery(activeOrgId);

  if (!isLoading && billing && !billing.enabled) return null;

  const returnUrl = window.location.href;
  const billingReference = activeOrgId
    ? ({ referenceId: activeOrgId, customerType: "organization" } as const)
    : {};

  async function handleUpgrade(plan: "starter" | "pro") {
    try {
      await auth.subscription.upgrade({
        ...billingReference,
        plan,
        successUrl: returnUrl,
        cancelUrl: returnUrl,
      });
    } catch (error) {
      console.error("Failed to start upgrade:", error);
    }
  }

  async function handleManageBilling() {
    try {
      await auth.subscription.billingPortal({
        ...billingReference,
        returnUrl,
      });
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  }

  const hasSubscription =
    billing?.status === "active" || billing?.status === "trialing";
  const isCanceling = hasSubscription && billing.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>Billing</CardTitle>
        </div>
        <CardDescription>
          Manage your subscription and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : hasSubscription ? (
          <>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {billing.plan.charAt(0).toUpperCase() + billing.plan.slice(1)}{" "}
                plan
                <span className="ml-2 text-xs text-muted-foreground">
                  ({billing.status})
                </span>
              </p>
              {billing.periodEnd && (
                <p className="text-sm text-muted-foreground">
                  {isCanceling ? "Access until" : "Renews on"}{" "}
                  {new Date(billing.periodEnd).toLocaleDateString()}
                </p>
              )}
              {isCanceling && (
                <p className="text-sm text-amber-600">
                  Your subscription will not renew. You can restore it from the
                  billing portal.
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleManageBilling}>
              Manage Billing
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You are on the Free plan.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpgrade("starter")}
              >
                Upgrade to Starter
              </Button>
              <Button onClick={() => handleUpgrade("pro")}>
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function AppearanceCard() {
  const { preference, setPreference } = useTheme();
  const themeLabelId = useId();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <CardTitle>Appearance</CardTitle>
        </div>
        <CardDescription>
          Customize the look and feel of the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            {/* Not a <label>: it names a radiogroup, which htmlFor can't target. */}
            <Label asChild>
              <span id={themeLabelId}>Theme</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Choose light, dark, or follow your OS setting.
            </p>
          </div>
          {/* type="single" brings radiogroup semantics and arrow keys, so no
              keyboard handling here. It emits "" when the active item is
              toggled off, which the lookup below ignores. */}
          <ToggleGroup
            type="single"
            value={preference}
            onValueChange={(value) => {
              const option = THEME_OPTIONS.find((o) => o.value === value);
              if (option) setPreference(option.value);
            }}
            aria-labelledby={themeLabelId}
            className="rounded-lg border bg-muted p-1"
          >
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={label}
                title={label}
                className="size-9 data-[state=on]:bg-background data-[state=on]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
}
