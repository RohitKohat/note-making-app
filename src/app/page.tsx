import { redirect } from "next/navigation";
import { getUser } from "@/auth/server";

import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import HomeToast from "@/components/HomeToast";
import { prisma } from "@/db/prisma";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function HomePage({ searchParams }: Props) {
  const user = await getUser();

  // ✅ If no user, redirect BEFORE rendering
  if (!user) {
    redirect("/login");
  }

  const noteIdParam = searchParams.noteId;
  const noteId = Array.isArray(noteIdParam) ? noteIdParam[0] : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user.id },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        
        <NewNoteButton />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
      <HomeToast />
    </div>
  );
}
