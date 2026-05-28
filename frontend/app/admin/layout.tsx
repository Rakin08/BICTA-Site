"use client";

import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bicta-void">
      <AdminNav />
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
