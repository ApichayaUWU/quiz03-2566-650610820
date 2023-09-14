import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  //let message = null;

  let filtered = DB.messages;
  const f = DB.messages.findIndex((std) => std.roomId === roomId);
  if (roomId !== null) {
    filtered = filtered.filter((std) => std.roomId === roomId);
  }

  if (f === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, message: filtered });
};

export const POST = async (request) => {
  const body = await request.json();
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const f = DB.rooms.findIndex((std) => std.roomId === roomId);
  if (f === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const body = await request.json();

  let role = null;
  let messageId = null;
  //const payload = checkToken();
  try {
    const payload = checkToken();

    messageId = payload.messageId;
    role = payload.role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  if (role !== "SUPER_ADMIN")
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  readDB();

  const f = DB.messages.findIndex((std) => std.messageId === body.messageId);

  if (f === -1)
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );

  DB.messages.splice(f, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
