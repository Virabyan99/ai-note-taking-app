"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { de } from "zod/v4/locales";

interface CreateNoteDialogProps {
  note: Doc<"notes">
}

export function NotePreviewDialog({note}: CreateNoteDialogProps) {

  const searchParams = useSearchParams()
  const isOpen = searchParams.get("noteId") === note._id
  const deleteNote = useMutation(api.notes.deleteNote);
  const [deletePending, setDeletePending] = useState(false);

  async function handleDelete() {
    setDeletePending(true);
    try {
      await deleteNote({ noteId: note._id });
      toast.success("Note deleted successfully");
      handleClose();
    } catch (error) {
      console.error("Error deleting Note", error);
      toast.error("Failed to delete Note. Please try again.");
      setDeletePending(false);
    } finally {
      setDeletePending(false);
    } 
  }

  function handleClose() {
    if(deletePending) return;
    window.history.pushState(null, "", window.location.pathname);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-wrap">{note.body}</div>
        <DialogFooter className="mt-6">
          <Button variant="destructive" className="gap-2" disabled={deletePending} onClick={handleDelete} >
            <Trash2 size={16} />
            {deletePending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
