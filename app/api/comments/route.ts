import { NextResponse } from "next/server";
import { createClient } from "contentful-management";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message, postSlug, userImage } = body;

  // Validasi sederhana
  if (!message || !postSlug) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  try {
    // Client khusus untuk MENULIS data (Management API)
    const cmaClient = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    });

    const space = await cmaClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    // Buat entry baru di Contentful
    const entry = await environment.createEntry("comment", {
      fields: {
        name: { "en-US": name },
        email: { "en-US": email },
        message: { "en-US": message },
        postSlug: { "en-US": postSlug },
        userImage: { "en-US": userImage },
        date: { "en-US": new Date().toISOString() },
      },
    });

    // Publikasikan entry agar langsung muncul
    await entry.publish();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan komentar" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  // 1. Cek apakah user login
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await request.json();
  // Email Owner (Ganti dengan email Google Anda yang asli)
  const OWNER_EMAIL = "hzqoola@gmail.com";

  try {
    const cmaClient = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    });

    const space = await cmaClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    // 2. Ambil data komentar dari Contentful untuk dicek pemiliknya
    const entry = await environment.getEntry(commentId);
    const commentAuthorEmail = entry.fields.email["en-US"];

    // 3. Validasi Hak Akses
    const isOwner = session.user.email === OWNER_EMAIL;
    const isAuthor = session.user.email === commentAuthorEmail;

    if (!isOwner && !isAuthor) {
      return NextResponse.json(
        { error: "Anda tidak berhak menghapus komentar ini" },
        { status: 403 }
      );
    }

    // 4. Proses Hapus (Unpublish dulu, baru Delete)
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    await entry.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Gagal menghapus komentar" },
      { status: 500 }
    );
  }
}
