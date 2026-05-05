"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";

export function CategoryForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", slug: "", description: "", imageUrl: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await clientFetch("/admin/categories", { method: "POST", body: JSON.stringify(form) });
    setForm({ name: "", slug: "", description: "", imageUrl: "" });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-oat bg-white p-5 md:grid-cols-4">
      {Object.keys(form).map((field) => (
        <Input key={field} placeholder={field} value={form[field as keyof typeof form]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
      ))}
      <Button className="md:col-span-4">Create category</Button>
    </form>
  );
}
