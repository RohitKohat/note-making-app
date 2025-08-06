// app/page.tsx or app/page.tsx (or wherever your HomePage is)

import { getUser } from "@/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import HomeToast from "@/components/HomeToast";
import { prisma } from "@/db/prisma";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function HomePage({ searchParams }: Props) {
  const user = await getUser(); // ✅ get user on server
  const noteIdParam = searchParams.noteId;

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user?.id },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />

      <HomeToast />
    </div>
  );
}

export default HomePage;
