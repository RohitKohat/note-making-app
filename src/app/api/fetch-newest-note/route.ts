// /app/api/fetch-newest-note/route.ts

import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const newestNote = await prisma.note.findFirst({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (!newestNote) {
      return NextResponse.json({ error: "No notes found" }, { status: 404 });
    }

    return NextResponse.json({ newestNoteId: newestNote.id });
  } catch (error) {
    console.error("Error fetching newest note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}