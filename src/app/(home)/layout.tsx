import { HomeNavbar } from "@/features/home/components/HomeNavbar";
import { HomeSidebar } from "@/features/home/components/home-sidebar/HomeSidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex min-h-screen pt-16">
          <HomeSidebar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
