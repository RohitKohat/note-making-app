"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";

function NewNoteButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // or use `User` type from Supabase

  useEffect(() => {
    // ✅ Fetch user client-side
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };

    getUser();
  }, []);

  const handleClickNewNoteButton = async () => {
    console.log("🚀 Clicked New Note Button");
    console.log("👤 user:", user);

    if (!user) {
      console.warn("⚠ No user found, redirecting to login.");
      router.push("/login");
      return;
    }

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

export default NewNoteButton;
