"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as "seeker" | "recruiter" | "admin";

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setPending(true);
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') ?? '/'
    const { data, error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
      callbackURL: redirectTo
    });
    setPending(false);

    if (authError) {
      setError(authError.message ?? "Something went wrong. Please try again.");
      return;
    }
    console.log(data);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
      <Card className="w-full max-w-sm border-white/10 bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Create Account
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm leading-none font-medium">I am a</span>
              <div className="grid grid-cols-3 gap-2">
                {(["seeker", "recruiter", "admin"] as const).map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-950/50 px-2 py-2 text-sm text-zinc-300 capitalize transition-colors has-checked:border-violet-500 has-checked:bg-violet-500/10 has-checked:text-white"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      defaultChecked={value === "seeker"}
                      className="accent-violet-500"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-violet-400 hover:text-violet-300">
          Sign in
        </Link>
      </p>
    </main>
  );
}
