import { NextResponse } from "next/server";
import { createClient } from "contentful-management";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const OWNER_EMAIL = "hzqoola@gmail.com";

const getContentfulEnvironment = async () => {
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;

  if (!managementToken || !spaceId) {
    throw new Error("Contentful credentials are not configured");
  }

  const cmaClient = createClient({ accessToken: managementToken });
  const space = await cmaClient.getSpace(spaceId);
  return space.getEnvironment("master");
};

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getRawString = (value: unknown) =>
  typeof value === "string" ? value : "";

export async function POST(request: Request) {
  const body = await request.json();

  const name = getString(body?.name);
  const email = getString(body?.email);
  const message = getString(body?.message);
  const postSlug = getString(body?.postSlug);
  const userImage = getRawString(body?.userImage);

  if (!message || !postSlug) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  try {
    const environment = await getContentfulEnvironment();

    const entry = await environment.createEntry("comment", {
      fields: {
        name: { "en-US": name || "Guest" },
        email: { "en-US": email },
        message: { "en-US": message },
        postSlug: { "en-US": postSlug },
        userImage: { "en-US": userImage },
        date: { "en-US": new Date().toISOString() },
      },
    });

    await entry.publish();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving comment:", error);
    // Tambahkan ini sementara:
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Gagal menyimpan komentar", detail: errorMessage },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const commentId = getString(body?.commentId);
  const message = getString(body?.message);

  if (!commentId) {
    return NextResponse.json(
      { error: "commentId tidak valid" },
      { status: 400 },
    );
  }

  try {
    const environment = await getContentfulEnvironment();

    const entry = await environment.getEntry(commentId);

    const commentAuthorEmail = getString(entry.fields.email?.["en-US"]);

    const isOwner = session.user.email === OWNER_EMAIL;
    const isAuthor = session.user.email === commentAuthorEmail;

    if (!isOwner && !isAuthor) {
      return NextResponse.json(
        { error: "Anda tidak berhak mengedit komentar ini" },
        { status: 403 },
      );
    }

    if (!entry.fields.message) entry.fields.message = {};

    entry.fields.message["en-US"] = message;

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate komentar" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const commentId = getString(body?.commentId);

  if (!commentId) {
    return NextResponse.json(
      { error: "commentId tidak valid" },
      { status: 400 },
    );
  }

  try {
    const environment = await getContentfulEnvironment();

    const entry = await environment.getEntry(commentId);
    const commentAuthorEmail = entry.fields.email["en-US"];

    const isOwner = session.user.email === OWNER_EMAIL;
    const isAuthor = session.user.email === commentAuthorEmail;

    if (!isOwner && !isAuthor) {
      return NextResponse.json(
        { error: "Anda tidak berhak menghapus komentar ini" },
        { status: 403 },
      );
    }

    if (entry.isPublished()) {
      await entry.unpublish();
    }
    await entry.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Gagal menghapus komentar" },
      { status: 500 },
    );
  }
}
