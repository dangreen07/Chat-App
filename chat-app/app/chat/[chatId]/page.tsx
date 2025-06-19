import Chat from "@/components/chat";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Page({ searchParams, params }: { searchParams: Promise<{ message?: string }>, params: Promise<{ chatId: string }> }) {
    const { message } = await searchParams;
    const { chatId } = await params;

    let generate = false;

    if (!message && !chatId) {
        return redirect("/");
    }

    if (message) {
        generate = true;
    }

    const messages = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/messages`);
    const data = await messages.json() as { messages: { role: "user" | "assistant", content: string }[] };

    if (data.messages.length > 1) {
        generate = false;
    }

    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AppSidebar />
                <Chat chatId={chatId} initialMessages={data.messages.length > 0 ? data.messages : message ? [{ role: "user", content: decodeURIComponent(message) }] : undefined} onLoadGenerate={generate} />
            </SidebarProvider>
        </div>
    );
}