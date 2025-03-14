"use client";

import Link from "next/link";
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
    url: "/trending",
    title: "Trending",
    icon: FlameIcon,
  },
];

export function MainSection() {
  return (
    <SidebarGroup>
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
