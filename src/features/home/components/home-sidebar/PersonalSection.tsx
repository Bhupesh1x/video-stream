"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const routes = [
  {
    url: "/playlists/history",
    title: "History",
    icon: HistoryIcon,
    auth: true,
  },
  {
    url: "/playlists/liked",
    title: "Liked videos",
    icon: ThumbsUpIcon,
    auth: true,
  },
  {
    url: "/playlists",
    title: "All playlists",
    icon: ListVideoIcon,
    auth: true,
  },
];

export function PersonalSection() {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
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
