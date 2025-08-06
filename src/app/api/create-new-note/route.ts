import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { createClient } from "@/auth/server"; // your working Supabase server client

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        authorId: user.id,
        text: "",
      },
    });

    return NextResponse.json({ noteId: newNote.id });
  } catch (err) {
    console.error("Error creating note:", err);
    return NextResponse.json({ error: "Note creation failed" }, { status: 500 });
  }
}