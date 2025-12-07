import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItem {
  icon: LucideIcon;
  label: string;
  to: string;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {items.map((item) => (
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
  );
}
