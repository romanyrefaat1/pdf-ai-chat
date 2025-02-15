"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, PlusCircle } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import UserItem from "./user-item";
import ChatsList from "./chats-list";
import { ModeToggle } from "./theme-toggler";

const Sidebar = ({ defaultCollapse }: { defaultCollapse: boolean }) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isReseting, setIsReseting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapse);

  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !isMobile) {
      const savedWidth = localStorage.getItem("sidebar-width");
      if (savedWidth) {
        const width = parseInt(savedWidth);
        setSidebarWidth(width);
      }
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || defaultCollapse) {
      setIsCollapsed(true);
    }
  }, [isMobile, pathname, defaultCollapse]);

  const handleCreate = () => {
    redirect(`/chat`);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    newWidth = Math.max(240, Math.min(480, newWidth));
    setSidebarWidth(newWidth);
    localStorage.setItem("sidebar-width", newWidth.toString());
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleReset = () => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
    } else {
      if (isCollapsed) {
        const savedWidth = localStorage.getItem("sidebar-width");
        const width = savedWidth ? parseInt(savedWidth) : 240;
        setSidebarWidth(width);
      }
      setIsCollapsed(!isCollapsed);
    }
    setIsReseting(true);
    setTimeout(() => setIsReseting(false), 300);
  };

  if (!mounted) return null;

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{
          width: isCollapsed ? 0 : isMobile ? "100vw" : `${sidebarWidth}px`,
        }}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col z-[99999]",
          isReseting && "transition-all ease-in-out duration-300"
        )}
      >
        {!isMobile && (
          <div
            role="button"
            onClick={() => setIsCollapsed(true)}
            className={cn(
              "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition"
            )}
          >
            <ChevronsLeft className="w-6 h-6" />
          </div>
        )}
        <UserItem />
        <div
          role="button"
          onClick={handleCreate}
          className="flex gap-x-2 items-center transition p-2 hover:bg-foreground/5"
        >
          <PlusCircle className="w-4 h-4 text-foreground" />
          Start Chat
        </div>
        <ModeToggle />
        <div className="mt-4 p-2">
          <ChatsList />
        </div>
        {!isMobile && (
          <div
            onMouseDown={handleMouseDown}
            onClick={() => {
              setSidebarWidth(240);
              localStorage.setItem("sidebar-width", "240");
            }}
            className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
          />
        )}
      </aside>
      <div
        ref={navbarRef}
        style={{
          left: isCollapsed ? 0 : isMobile ? "calc(100vw - 65px)" : `${sidebarWidth}px`,
          width: isCollapsed
            ? "100%"
            : isMobile
            ? "45px"
            : `calc(100% - ${sidebarWidth}px)`,
        }}
        className={cn(
          "absolute top-0 w-fit bg-[red] w-full z-[99999]",
          isReseting && "transition-all ease-in-out duration-300"
        )}
      >
        {(isCollapsed || isMobile) && (
          <nav className="bg-transparent px-3 py-2 w-full bg-[blue] bg-secondary w-full">
            <MenuIcon
              role="button"
              onClick={handleReset}
              className="h-6 w-6 text-muted-foreground cursor-pointer"
            />
          </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;
