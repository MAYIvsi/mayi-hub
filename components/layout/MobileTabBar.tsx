"use client";

import { LayoutDashboard, MessageSquareText, FolderSearch } from "lucide-react";

import { NavItem } from "@/components/layout/NavItem";
import { cn } from "@/lib/cn";

export function MobileTabBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 md:hidden",
        "border-t border-white/5 bg-bg-app/80 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1 px-2 py-2">
        <NavItem
          href="/"
          label="控制台"
          icon={<LayoutDashboard className="h-4 w-4 text-text-primary" />}
        />
        <NavItem
          href="/chat"
          label="梅子频道"
          icon={<MessageSquareText className="h-4 w-4 text-text-primary" />}
        />
        <NavItem
          href="/puzzles"
          label="档案"
          icon={<FolderSearch className="h-4 w-4 text-text-primary" />}
        />
      </div>
    </div>
  );
}

