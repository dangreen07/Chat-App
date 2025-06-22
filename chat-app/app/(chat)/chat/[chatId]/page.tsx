import Chat from "@/components/chat";
import { redirect } from "next/navigation";

async function getChatInfo(chatId: string) {
    const chat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}`);
    const chatData = await chat.json() as { chat: { chat_name: string | null } };
    return chatData;
}

async function getChatMessages(chatId: string) {
    const messages = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/messages`);
    const data = await messages.json() as { messages: { role: "user" | "assistant", content: string }[] };
    return data;
}

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

    const [chatData, data] = await Promise.all([getChatInfo(chatId), getChatMessages(chatId)]);

    if (!chatData.chat) {
        return redirect("/");
    }
    if (!chatData.chat.chat_name || chatData.chat.chat_name === "") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/auto-name`, {
            method: "POST",
        });
    }

    if (data.messages.length > 1) {
        generate = false;
    }

    return (
        <Chat chatId={chatId} initialMessages={data.messages.length > 0 ? data.messages : message ? [{ role: "user", content: decodeURIComponent(message) }] : undefined} onLoadGenerate={generate} />
    );
}