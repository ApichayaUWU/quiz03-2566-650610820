import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Apichaya Inkhiewsai",
    studentId: "650610820",
  });
};
