"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Bot, ChevronsUpDown, Info, LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, UserProfile } from "@/lib/api";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "3.05rem" },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: { x: 0, opacity: 1, transition: { x: { stiffness: 1000, velocity: -100 } } },
  closed: { x: -20, opacity: 0, transition: { x: { stiffness: 100 } } },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
};

const staggerVariants = {
  open: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeView = searchParams.get("view") ?? "information";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    getCurrentUser(token).then(setUser).catch(() => {});
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard?view=information", view: "information", icon: LayoutDashboard },
    { label: "Information", href: "/dashboard?view=information", view: "information", icon: Info },
    { label: "Agent", href: "/dashboard?view=agent", view: "agent", icon: Bot },
    { label: "Profile", href: "/dashboard?view=profile", view: "profile", icon: User },
  ];

  return (
    <motion.div
      className="sidebar fixed left-0 z-40 h-full shrink-0 border-r"
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-neutral-900 transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">

            {/* Logo / Brand */}
            <div className="flex h-[54px] w-full shrink-0 border-b p-2 items-center">
              <div className="flex w-full items-center gap-2 px-2">
                <div className="h-5 w-5 flex-shrink-0 rounded-md bg-black dark:bg-white" />
                <motion.li variants={variants}>
                  {!isCollapsed && (
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">CollegeSodhpuch</p>
                  )}
                </motion.li>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className="flex w-full flex-col gap-1">
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                          activeView === item.view && "bg-muted text-blue-600",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <motion.li variants={variants}>
                          {!isCollapsed && (
                            <p className="ml-2 text-sm font-medium">{item.label}</p>
                          )}
                        </motion.li>
                      </Link>
                    ))}

                    <Separator className="w-full my-1" />
                  </div>
                </ScrollArea>
              </div>

              {/* Bottom: account */}
              <div className="flex flex-col p-2">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-full items-center justify-start gap-2 px-1.5 h-11"
                    >
                      <Avatar className="size-8 rounded-full flex-shrink-0 ring-2 ring-violet-200 dark:ring-violet-800">
                        <AvatarFallback className="text-sm font-bold bg-violet-600 text-white rounded-full">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-full items-center gap-2 overflow-hidden"
                      >
                        {!isCollapsed && (
                          <>
                            <div className="flex flex-col items-start min-w-0">
                              <p className="text-xs font-medium truncate max-w-[120px]">
                                {user?.full_name ?? "Not signed in"}
                              </p>
                              {user?.email && (
                                <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                  {user.email}
                                </p>
                              )}
                            </div>
                            <ChevronsUpDown className="ml-auto h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={5} align="start" className="w-52">
                    <div className="flex flex-row items-center gap-2 p-2">
                      <Avatar className="size-9 rounded-full ring-2 ring-violet-200">
                        <AvatarFallback className="text-sm font-bold bg-violet-600 text-white rounded-full">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-sm font-medium truncate">{user?.full_name ?? "Guest"}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email ?? "Not signed in"}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
                      <Link href="/dashboard?view=profile">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {user ? (
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild className="flex items-center gap-2 cursor-pointer">
                        <Link href="/login">
                          <User className="h-4 w-4" /> Sign in
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

// Legacy exports kept for any remaining imports
export { AppSidebar as Sidebar };
export const SidebarProvider = ({ children, defaultOpen: _d }: { children: React.ReactNode; defaultOpen?: boolean }) => <>{children}</>;
export const SidebarBody = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
export const SidebarContent = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
export const SidebarHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
export const SidebarFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
export const SidebarGroup = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>;
export const SidebarGroupContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const SidebarMenu = ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>;
export const SidebarMenuItem = ({ children }: { children: React.ReactNode }) => <li>{children}</li>;
export const SidebarMenuButton = ({ children, asChild, isActive: _a, tooltip: _t, size: _s, className, ...props }: { children: React.ReactNode; asChild?: boolean; isActive?: boolean; tooltip?: string; size?: string; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    return React.cloneElement(child, { className: cn(child.props.className, className) });
  }
  return <button className={className} {...props}>{children}</button>;
};
export const SidebarTrigger = () => null;
export const SidebarLink = ({ link, className }: { link: { label: string; href: string; icon: React.ReactNode }; className?: string }) => (
  <Link href={link.href} className={cn("flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted text-sm", className)}>
    {link.icon}<span>{link.label}</span>
  </Link>
);
export const useSidebar = () => ({ open: true, setOpen: () => {}, animate: true });

import React from "react";
