"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: null,
  },
  {
    name: "Students",
    href: "/students",
    icon: null,
  },
  {
    name: "Enrollments",
    href: "/enrollments/new",
    icon: null,
  },
  {
    name: "Admin",
    children: [
      {
        name: "Accounts",
        href: "/admin/accounts",
      },
      {
        name: "Fee Items",
        href: "/admin/fee-items",
      },
      {
        name: "Fee Schedules",
        href: "/admin/fee-schedules",
      },
      {
        name: "Subjects",
        href: "/admin/subjects",
      },
      {
        name: "Curriculum Versions",
        href: "/admin/curriculum-versions",
      },
    ],
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navigation.map((item) => {
        if (item.children) {
          return (
            <div key={item.name} className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.name}
              </div>
              {item.children.map((child) => {
                const isActive = pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={clsx(
                      "block px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          );
        }

        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "block px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
