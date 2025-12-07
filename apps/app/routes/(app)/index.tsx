import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/(app)/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
    },
    {
      title: "Active Sessions",
      value: "89",
      change: "+5%",
      icon: Activity,
    },
    {
      title: "Reports Generated",
      value: "456",
      change: "+23%",
      icon: FileText,
    },
    {
      title: "Growth Rate",
      value: "18.2%",
      change: "+2.1%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your application.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">User action performed</p>
                    <p className="text-xs text-muted-foreground">
                      {i} hour{i > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <FileText className="h-5 w-5 mb-2" />
                <p className="text-sm font-medium">Generate Report</p>
              </button>
              <button
                type="button"
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <Users className="h-5 w-5 mb-2" />
                <p className="text-sm font-medium">Manage Users</p>
              </button>
              <button
                type="button"
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <Activity className="h-5 w-5 mb-2" />
                <p className="text-sm font-medium">View Analytics</p>
              </button>
              <button
                type="button"
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <TrendingUp className="h-5 w-5 mb-2" />
                <p className="text-sm font-medium">Export Data</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
