import { NextResponse } from "next/server";
import { verifySession, ADMIN_USER } from "@/lib/auth";

export async function GET() {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: { username: ADMIN_USER, role: "Super Administrator" },
  });
}
