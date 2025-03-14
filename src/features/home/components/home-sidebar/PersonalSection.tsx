"use client";

import Link from "next/link";
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
  },
];

export function PersonalSection() {
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
              onClick={() => {}}
            >
              <Link href={route.url} className="flex items-center gap-4">
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
