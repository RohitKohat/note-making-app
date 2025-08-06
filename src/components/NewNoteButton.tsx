import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";
import { createBrowserClient } from "@supabase/ssr";

function NewNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🧠 Fetch the user on client mount
  useEffect(() => {
    const getUser = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.warn("⚠ Could not fetch user:", error?.message);
        setUserId(null);
      } else {
        setUserId(data.user.id);
      }
    };

    getUser();
  }, []);

  const handleClickNewNoteButton = async () => {
    console.log("🚀 Clicked New Note Button");
    console.log("👤 userId:", userId);

    if (!userId) {
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
