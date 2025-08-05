import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma"; // ✅ This is the Prisma import line
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { auth } = await createClient();

    const {
      data: { user },
    } = await auth.getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.note.create({ // ✅ This is where Prisma is used
      data: {
        authorId: user.id,
        text: "",
      },
    });

    return NextResponse.json({ noteId: note.id });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}