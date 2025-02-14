"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useMutation } from "convex/react";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreVerticalIcon,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./button";

interface ItemProps {
  id?: Id<`documents`>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSidebar?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
  onDelete: () => void;
}

const Item = ({
  onClick,
  onDelete,
  icon: Icon,
  label,
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  isSidebar,
}: ItemProps) => {
  const handleMore = () => {};
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : `12px` }}
      className={cn(
        "group min-x-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary-5 text-primary"
      )}
    >
      {label && <span className="truncate">{label}</span>}
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted gap-1 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">CTRL</span> + K
        </kbd>
      )}
      {isSidebar && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="ml-auto flex items-center gap-x-2">
              <div
                role="button"
                onClick={handleMore}
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreVerticalIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80"
            alignOffset={11}
            align="start"
            // forceMount
          >
            <div>
              <Button size={`sm`} variant={`warn`} onClick={onDelete} className="flex gap-x-2"><Trash2/> Delete Chat</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : `12px` }}
      className="flex g-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
