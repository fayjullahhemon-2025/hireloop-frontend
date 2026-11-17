import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { DashboardSidebar } from "../../components/app-sidebar";

const DashboardLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar></DashboardSidebar>
        <main className="min-w-0 flex-1">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayoutPage;
