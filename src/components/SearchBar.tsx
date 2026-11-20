"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(activeSearch);

  useEffect(() => {
    setValue(activeSearch);
  }, [activeSearch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const field = formData.get("searchField");
    const search = typeof field === "string" ? field.trim() : "";
    if (search) {
      const params = new URLSearchParams();
      params.set("search", search);
      router.push(`/browse-jobs?${params.toString()}`);
    } else {
      router.push("/browse-jobs");
    }
  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/60 p-2 pl-4"
    >
      <Search className="size-4 shrink-0 text-zinc-500" />
      <Input
        name="searchField"
        type="search"
        aria-label="Search jobs"
        placeholder="Search by job title, keywords..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 placeholder:text-zinc-500"
      />
      <Button
        type="submit"
        className="h-9 shrink-0 rounded-lg bg-white px-5 text-zinc-950 hover:bg-zinc-200"
      >
        Search Jobs
      </Button>
    </form>
  );
};

export default SearchBar;
