"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters")
});

const registerFormSchema = loginFormSchema.extend({
  name: z.string().min(2, "Name is required")
});

type AuthInput = {
  name?: string;
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthInput>({
    resolver: zodResolver(mode === "login" ? loginFormSchema : registerFormSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  async function submit(form: AuthInput) {
    setError("");
    try {
      await clientFetch(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(mode === "login" ? { email: form.email, password: form.password } : form)
      });
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-md space-y-4 border border-oat bg-white p-6">
      {mode === "register" ? <Input placeholder="Name" {...register("name")} /> : null}
      {errors.name ? <p className="text-xs text-wine">{errors.name.message}</p> : null}
      <Input type="email" placeholder="Email" {...register("email")} />
      {errors.email ? <p className="text-xs text-wine">{errors.email.message}</p> : null}
      <Input type="password" placeholder="Password" {...register("password")} />
      {errors.password ? <p className="text-xs text-wine">{errors.password.message}</p> : null}
      {error ? <p className="text-sm text-wine">{error}</p> : null}
      <Button className="w-full" disabled={isSubmitting}>{mode === "login" ? "Sign in" : "Create account"}</Button>
    </form>
  );
}
