"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Camera, BookOpen, Library, Home } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Terjemahkan", href: "/translate", icon: Camera },
  { label: "Belajar", href: "/learn", icon: BookOpen },
  { label: "Kamus BISINDO", href: "/dictionary", icon: Library },
];

interface NavigationProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  onItemClick?: () => void;
}

export function Navigation({
  className,
  orientation = "horizontal",
  onItemClick,
}: NavigationProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-1 sm:gap-2"
          : "flex flex-col gap-1 w-full",
        className
      )}
      aria-label="Navigasi Utama"
    >
      {NAV_ITEMS.map((item) => {
        const active = isItemActive(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              orientation === "vertical" && "w-full justify-start py-2.5 text-base"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
