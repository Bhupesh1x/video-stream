"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const routes = [
  {
    url: "/",
    title: "Home",
    icon: HomeIcon,
  },
  {
    url: "/feed/subscriptions",
    title: "Subscription",
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    url: "/feed/trending",
    title: "Trending",
    icon: FlameIcon,
  },
];

export function MainSection() {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((route) => (
          <SidebarMenuItem key={route.title}>
            <SidebarMenuButton
              asChild
              tooltip={route.title}
              isActive={false}
              onClick={(e) => {
                if (!isSignedIn && route?.auth) {
                  e.preventDefault();
                  clerk.openSignIn();
                }
              }}
            >
              <Link
                prefetch
                href={route.url}
                className="flex items-center gap-4"
              >
                <route.icon />
                <span className="text-sm">{route.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
