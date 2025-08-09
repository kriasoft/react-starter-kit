/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Button } from "@repo/ui";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Settings,
  Users,
  Activity,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: Activity, label: "Analytics", to: "/analytics" },
    { icon: Users, label: "Users", to: "/users" },
    { icon: FileText, label: "Reports", to: "/reports" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out bg-muted/50 border-r overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="h-14 flex items-center px-4 border-b">
            <h2 className="font-semibold text-lg">Console</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                activeProps={{
                  className: "bg-accent text-accent-foreground",
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/10" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User</p>
                <p className="text-xs text-muted-foreground truncate">
                  user@example.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <header className="h-14 border-b bg-background flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="flex-1 flex items-center gap-4">
            <h1 className="text-lg font-semibold">Application</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
