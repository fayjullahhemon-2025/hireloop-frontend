"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { authClient, signIn } from "@/lib/auth-client";

export default function SignInPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        setPending(true);
        const { data, error: authError } = await signIn.email({
            email,
            password,
        });
        setPending(false);

        if (authError) {
            setError(authError.message ?? "Something went wrong. Please try again.");
            return;
        }
        console.log(data)
        router.push("/");
        router.refresh();
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
            <Card className="w-full max-w-sm border-white/10 bg-zinc-900 text-white">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Sign In</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your email and password to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        <Button type="submit" disabled={pending} className="w-full">
                            {pending ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <p className="text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-violet-400 hover:text-violet-300">
                    Sign up
                </Link>
            </p>
        </main>
    );
}
