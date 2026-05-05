import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <div className="container-padded py-16">
      <h1 className="text-center font-serif text-5xl">Sign in</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-sm text-smoke">Access orders, wishlist, and saved account details.</p>
      <div className="mt-8"><AuthForm mode="login" /></div>
      <p className="mt-5 text-center text-sm text-smoke">New here? <Link href="/auth/register" className="text-ink underline">Create an account</Link></p>
    </div>
  );
}
