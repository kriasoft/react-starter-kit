import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Download, FileText, Filter } from "lucide-react";

export const Route = createFileRoute("/(app)/reports")({
  component: Reports,
});

function Reports() {
  const reports = [
    {
      id: 1,
      name: "Monthly Sales Report",
      type: "Sales",
      date: "2024-01-01",
      status: "Ready",
    },
    {
      id: 2,
      name: "User Activity Report",
      type: "Analytics",
      date: "2024-01-15",
      status: "Ready",
    },
    {
      id: 3,
      name: "Financial Summary",
      type: "Finance",
      date: "2024-01-20",
      status: "Processing",
    },
    {
      id: 4,
      name: "Performance Metrics",
      type: "Performance",
      date: "2024-01-25",
      status: "Ready",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-muted-foreground">
          Generate and download various reports for your data.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter reports by type and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Create a custom report based on your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Sales Report</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>User Report</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Financial Report</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Custom Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "Ready"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={report.status !== "Ready"}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
