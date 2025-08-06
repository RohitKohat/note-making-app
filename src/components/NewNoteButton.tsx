"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { createNoteAction } from "@/actions/notes";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

export default function NewNoteButton({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const uuid = uuidv4();
    const result = await createNoteAction(uuid);

    if (!result || result.errorMessage || !result.noteId) {
      console.error("❌ Failed to create note:", result?.errorMessage);
      alert("Failed to create note. Please try again.");
      setLoading(false);
      return;
    }

    router.push(`/?noteId=${result.noteId}&toastType=newNote`);
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="secondary"
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "New Note"}
    </Button>
  );
}