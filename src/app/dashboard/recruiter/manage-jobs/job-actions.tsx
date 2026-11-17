"use client";

import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function JobActions() {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        className="h-7 bg-violet-600/10 px-2.5 text-xs text-violet-400 hover:bg-violet-600/20"
      >
        <Pencil className="size-3.5" />
        Update
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        className="text-zinc-500 hover:text-red-400"
        aria-label="Delete job"
      >
        <Trash2 className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-zinc-500"
              aria-label="More options"
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>
            <Eye className="size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="size-4" />
            Edit Job
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="size-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-400 data-highlighted:text-red-400">
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
