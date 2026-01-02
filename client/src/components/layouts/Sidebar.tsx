import type { FC } from "react";
import {
  LayoutDashboard,
  KeyRound,
  Upload,
  Webhook,
  BarChart3,
  Settings,
  Images,
} from "lucide-react";
import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  icon: FC<{ className?: string }>;
  to: string;
};

const navItems: NavItem[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "API Keys",
    icon: KeyRound,
    to: "/api-keys",
  },
  {
    label: "Uploads",
    icon: Upload,
    to: "/uploads",
  },
  {
    label: "Webhooks",
    icon: Webhook,
    to: "/webhooks",
  },
  {
    label: "Usage",
    icon: BarChart3,
    to: "/usage",
  },
];

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-50 flex h-screen w-14 md:w-64 flex-col bg-base-200/50 border-r border-base-content/10 px-2">
      {/* Logo */}
      <div className="flex items-center gap-2 pl-1 md:px-3 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content font-bold">
          <Images size={25} />
        </div>
        <span className="hidden md:block text-lg font-semibold text-base-content">
          SnapURL
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="tooltip w-full">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden md:block">{item.label}</span>
                </NavLink>
                <span
                  className="tooltip-content tooltip-shown:opacity-100 tooltip-shown:visible"
                  role="tooltip"
                >
                  <span className="tooltip-body tooltip-primary">
                    Primary tooltip
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Settings */}
      <div className="pb-4">
        <NavLink
          to={"/settings"}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
            )
          }
        >
          <Settings className="h-5 w-5" />
          <span className="hidden md:block">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
