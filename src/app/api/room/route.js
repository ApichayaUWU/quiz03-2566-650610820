import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (request) => {
  readDB();
  const rooms = request.nextUrl.searchParams.get("rooms");

  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: 2,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  let username = null;
  let role = null;
  let roomName = null;
  //const payload = checkToken();
  try {
    const payload = checkToken();
    username = payload.username;
    roomName = payload.roomName;
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

  if (role !== "ADMIN" && role !== "SUPER_ADMIN")
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  readDB();

  const froom = DB.rooms.find((r) => roomName === r.roomName);
  if (froom)
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${body.roomName} already exists`,
      },
      { status: 400 }
    );

  const roomId = nanoid();

  DB.rooms.push({
    roomId,
    roomName,
  });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    //roomId,
    message: `Room ${body.roomName} has been created`,
  });
};
