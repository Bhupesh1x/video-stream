"use client";

import { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants";
import { useRouter } from "next/navigation";

export function SearchInput() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = new URL(
      "/search",
      APP_URL ? `https://${APP_URL}` : "http://localhost:3000"
    );
    const newQuery = value?.trim();

    url.searchParams.set("query", encodeURIComponent(newQuery));

    if (newQuery === "") {
      url.searchParams.delete("query");
    }

    setValue(newQuery);
    router.push(url.toString());
  }

  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          placeholder="Search"
          className="h-11 w-full border rounded-l-full focus:outline-none focus:border-blue-500 pl-3 transition"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value?.trim() ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full shrink-0"
            onClick={() => setValue("")}
          >
            <XIcon className="text-gray-500" />
          </Button>
        ) : null}
      </div>
      <button
        disabled={!value?.trim()}
        type="submit"
        className="bg-gray-100 px-5 py-2.5 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
}
