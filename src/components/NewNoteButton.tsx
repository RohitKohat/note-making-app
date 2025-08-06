"use client";

import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";

export default function NewNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    setLoading(true);

    const uuid = uuidv4();
    const result = await createNoteAction(uuid);
    console.log("✅ Note creation result:", result);

    router.push(`/?noteId=${uuid}&toastType=newNote`);
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
}
