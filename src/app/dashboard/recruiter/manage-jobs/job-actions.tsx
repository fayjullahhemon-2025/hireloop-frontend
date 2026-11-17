"use client";

import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteJobs } from "@/lib/actions/jobs";

export function JobActions({ jobId }: { jobId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!jobId) return;
    setPending(true);
    try {
      await deleteJobs(jobId);
      setOpen(false);
      toast.add({
        title: "Job Deleted",
        description: "Job is deleted Permenantly",
      })
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        className="h-7 bg-violet-600/10 px-2.5 text-xs text-violet-400 hover:bg-violet-600/20"
      >
        <Pencil className="size-3.5" />
        Update
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(value) => setOpen(Boolean(value))}
      >
        <AlertDialogTrigger
          render={
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-zinc-500 hover:text-red-400"
              aria-label="Delete job"
            />
          }
        >
          <Trash2 className="size-3.5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this job listing and all of its
              applicant data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending || !jobId}
              onClick={handleDelete}
            >
              <Trash2 className="size-3.5" />
              {pending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
          <DropdownMenuItem
            className="text-red-400 data-highlighted:text-red-400"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
