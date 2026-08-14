import { UserMenu } from "@/components/user-menu";
import { SIDEBAR_ID, sidebarItems } from "./constants";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    // Collapsing to zero width keeps the sidebar mounted so the transition can
    // run, which leaves its links focusable and readable by screen readers
    // while invisible. `inert` takes the whole subtree out of the tab order.
    <aside
      id={SIDEBAR_ID}
      inert={!isOpen}
      className={`${
        isOpen ? "w-64" : "w-0"
      } transition-all duration-300 ease-in-out bg-muted/50 border-r overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="h-14 flex items-center px-4 border-b">
          <h2 className="font-semibold text-lg">Console</h2>
        </div>
        <SidebarNav items={sidebarItems} />
        <UserMenu />
      </div>
    </aside>
  );
}
