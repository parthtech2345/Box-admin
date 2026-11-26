import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export default async function RootPage() {
  const isAuth = await verifySession();
  if (isAuth) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
