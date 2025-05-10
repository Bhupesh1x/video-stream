"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkLoading,
} from "@clerk/nextjs";
import { ClapperboardIcon, UserCircle, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AuthButton() {
  return (
    <>
      <ClerkLoading>
        <div className="size-8 bg-gray-200 rounded-full" />
      </ClerkLoading>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              href="/users/current"
              label="My profile"
              labelIcon={<UserIcon className="size-4" />}
            />
            <UserButton.Link
              href="/studio"
              label="Studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="rounded-full px-4 py-2 font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 transition shadow-none [&_svg:size-5]"
          >
            <UserCircle />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
