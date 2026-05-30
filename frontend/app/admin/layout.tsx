import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("bicta_token")?.value;

  if (!token) {
    redirect("/login?next=/admin");
  }

  let isAdmin = false;
  try {
    const res = await fetch(
      `${process.env.BICTA_API_URL || "https://bicta-site-production.up.railway.app"}/trpc/auth.me`,
      { headers: { Cookie: `bicta_token=${token}` }, cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      const role = data?.result?.data?.role;
      isAdmin = role === "admin";
    }
  } catch {
    // backend unreachable — check token payload as fallback
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      isAdmin = payload?.role === "admin";
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    redirect("/login?next=/admin");
  }

  return <>{children}</>;
}
