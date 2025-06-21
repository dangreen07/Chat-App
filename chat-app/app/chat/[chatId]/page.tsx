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

    const chat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`);
    const chatData = await chat.json() as { chat: { chat_name: string | null } };

    if (!chatData.chat) {
        return redirect("/");
    }
    if (!chatData.chat.chat_name || chatData.chat.chat_name === "") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/auto-name`, {
            method: "POST",
        });
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