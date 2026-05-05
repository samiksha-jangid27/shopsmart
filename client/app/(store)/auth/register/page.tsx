import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

export default function RegisterPage() {
  return (
    <div className="container-padded py-16">
      <h1 className="text-center font-serif text-5xl">Create account</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-sm text-smoke">Save wishlist pieces and create database-backed orders.</p>
      <div className="mt-8"><AuthForm mode="register" /></div>
      <p className="mt-5 text-center text-sm text-smoke">Already have an account? <Link href="/auth/login" className="text-ink underline">Sign in</Link></p>
    </div>
  );
}
