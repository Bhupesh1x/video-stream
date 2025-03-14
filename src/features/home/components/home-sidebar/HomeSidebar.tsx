import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { MainSection } from "./MainSection";
import { PersonalSection } from "./PersonalSection";

export function HomeSidebar() {
  return (
    <Sidebar className="pt-16 z-40 border-none">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
}
