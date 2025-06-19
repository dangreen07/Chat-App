import AppSidebar from "@/components/sidebar";
import Chat from "@/components/chat";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <Chat />
      </SidebarProvider>
    </div>
  );
}
