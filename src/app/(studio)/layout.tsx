import { StudioNavbar } from "@/features/studio/components/StudioNavbar";
import { StudioSidebar } from "@/features/studio/components/studio-sidebar/StudioSidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

function StudioLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-16">
          <StudioSidebar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default StudioLayout;
