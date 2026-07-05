import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (code !== process.env.DEV_ACCESS_CODE) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("dev_access", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}