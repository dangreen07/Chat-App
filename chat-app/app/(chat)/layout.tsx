import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </div>
    );  
}