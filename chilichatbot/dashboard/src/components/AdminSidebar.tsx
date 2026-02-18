"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "ภาพรวม", href: "/", icon: "📊" },
  { label: "สถิติการใช้งาน", href: "/admin/stats", icon: "📈" },
  { label: "ข้อความล่าสุด", href: "/admin/messages", icon: "💬" },
  { label: "จัดการเนื้อหา", href: "/admin/content", icon: "📝" },
  { label: "ทดสอบแชทบอท", href: "/admin/simulator", icon: "🤖" },
  { label: "ตั้งค่า LINE", href: "/admin/settings", icon: "⚙️" },
];

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🌶️</span>
          <div>
            <h1 className="text-lg font-bold text-green-700 dark:text-green-400">
              ChiliChatBot
            </h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-muted-foreground">LINE Bot เชื่อมต่อแล้ว</span>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-gray-900 border-r h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <span className="text-2xl">☰</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
