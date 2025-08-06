"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // ✅ Check this path
import type { User } from "@supabase/supabase-js";
import { createNoteAction } from "@/actions/notes"; // ✅ Make sure this returns { noteId }

type Props = {
  user: User | null;
};

export default function NewNoteButton({ user }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const result = await createNoteAction();

      if (!result || result.errorMessage || !result.noteId) {
        alert("❌ Failed to create a new note.");
        return;
      }

      router.push(`/?noteId=${result.noteId}&toastType=newNote`);
    } catch (err) {
      console.error("❌ Error creating note:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "New Note"}
    </Button>
  );
}