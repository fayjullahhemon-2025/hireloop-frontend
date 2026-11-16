"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Browse Jobs", href: "#jobs" },
  { label: "Companies", href: "#companies" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/5 bg-zinc-950">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="hidden  w-3/4 justify-end gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="#signin"
            className="text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            Sign In
          </Link>
          <Link
            href="#get-started"
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md p-2 text-zinc-300 hover:bg-white/5 hover:text-white md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 px-4 pt-2 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-3 px-3">
            <Link
              href="#signin"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Sign In
            </Link>
            <Link
              href="#get-started"
              onClick={() => setOpen(false)}
              className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
