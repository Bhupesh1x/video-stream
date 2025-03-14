import { SearchIcon } from "lucide-react";

export function SearchInput() {
  return (
    <form className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input
          placeholder="Search"
          className="h-11 w-full border rounded-l-full focus:outline-none focus:border-blue-500 pl-3 transition"
        />
      </div>
      <button className="bg-gray-100 px-5 py-2.5 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition">
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
}
