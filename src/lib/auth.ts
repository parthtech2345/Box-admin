import { cookies } from "next/headers";

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "password123";
const AUTH_COOKIE_NAME = "aavrit_admin_session";

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token === "authenticated_admin_token";
}

export { ADMIN_USER, ADMIN_PASS, AUTH_COOKIE_NAME };
