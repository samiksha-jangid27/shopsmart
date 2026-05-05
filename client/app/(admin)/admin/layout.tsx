import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-padded py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Admin</p>
      <h1 className="mt-3 font-serif text-5xl">Store studio</h1>
      <AdminNav />
      {children}
    </div>
  );
}
