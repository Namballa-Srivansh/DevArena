"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, Trophy, Terminal, PlusCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/arena", label: "Problems", icon: Swords },
    { href: "/submissions", label: "Submissions", icon: Trophy },
    { href: "/admin/create-challenge", label: "Create Problem", icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md group-hover:scale-105 transition-all">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-zinc-900 transition-colors">
              DEV<span className="text-indigo-600 font-extrabold">ARENA</span>
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                    isActive
                      ? "text-indigo-600 bg-indigo-50/50 shadow-sm border border-indigo-100/80"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-zinc-400")} />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
