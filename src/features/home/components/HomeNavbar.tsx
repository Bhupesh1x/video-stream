import Link from "next/link";
import Image from "next/image";

import { AuthButton } from "@/features/auth/components/AuthButton";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { SearchInput } from "./SearchInput";

export function HomeNavbar() {
  return (
    <nav className="fixed top-0 h-16 bg-white flex items-center w-full px-2 pr-5 z-50">
      <div className="flex items-center gap-1 flex-shrink-0">
        <SidebarTrigger />
        <Link href="/">
          <div className="flex items-center gap-1 p-4">
            <Image src="/images/logo.svg" alt="logo" height={32} width={32} />
            <p className="font-semibold text-lg tracking-tight">VideoStream</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 max-w-[720px] mx-auto">
        <SearchInput />
      </div>

      <AuthButton />
    </nav>
  );
}
