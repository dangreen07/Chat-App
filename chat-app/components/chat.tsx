"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";

export default function Chat({ chatId, initialMessages, onLoadGenerate = false }: { chatId?: string, initialMessages?: { role: "user" | "assistant", content: string }[], onLoadGenerate?: boolean }) {
    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>(initialMessages || []);
    const [message, setMessage] = useState("");
    const [generating, setGenerating] = useState(false);

    const router = useRouter();

    // React 18 Strict Mode mounts components twice in development, which would
    // cause this effect to run twice and therefore fire two API calls. We guard
    // against that with a ref so the "generate on load" logic executes only
    // once per real mount.
    const hasGeneratedOnLoad = useRef(false);

    useEffect(() => {
        if (hasGeneratedOnLoad.current) return;
        hasGeneratedOnLoad.current = true;

        if (onLoadGenerate && messages.length === 1) {
            const params = new URLSearchParams(window.location.search);
            params.delete("message");
            window.history.replaceState({}, "", window.location.pathname + "?" + params.toString());
            generateMessage(messages);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateMessage = async (newMessages: { role: "user" | "assistant", content: string }[]) => {
        setGenerating(true);

        // Make the request to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: newMessages, chat_id: chatId }),
        });

        // Guard against a missing body (shouldn't normally happen)
        if (!response.body) {
            setGenerating(false);
            return;
        }

        // Prepare to stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        // Seed the assistant's placeholder message
        const streamedMessages = [...newMessages, { role: "assistant" as const, content: "" }];
        setMessages(streamedMessages);

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                // Decode and append the new chunk
                const chunk = decoder.decode(value, { stream: true });
                streamedMessages[streamedMessages.length - 1].content += chunk;
                // Trigger a React update with a new array reference
                setMessages([...streamedMessages]);
            }
        } finally {
            // Ensure we reset the generating flag even if an error occurs
            setGenerating(false);
            reader.releaseLock();
        }
        if (messages.length == 2 && chatId) {
            // Auto-name the chat
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/auto-name`, {
                method: "POST"
            });
            // TODO: Update the sidebar
        }
    }

    const handleSend = async () => {
        // Prevent empty submissions
        if (!message.trim()) return;

        // Add the user's message to the local state first
        const newMessages = [...messages, { role: "user" as const, content: message }];
        setMessages(newMessages);
        setMessage("");
        // If no chatId, create a new chat
        if (!chatId) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/new-chat`, {
                method: "POST",
            });
            const data = await response.json();
            // Should only happen on the first message
            router.push(`/chat/${data.chat_id}?message=${encodeURIComponent(message)}`);
            return;
        }

        await generateMessage(newMessages);
    }

    return (
        <div className="flex-1 p-4 flex flex-col max-w-3xl mx-auto">
            <div id="chat-container" className="flex flex-col h-full gap-2 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`${message.role === "user" ? "text-black self-end" : "text-black self-start"} p-2 rounded-md bg-gray-200 max-w-2/3`}>
                        <Markdown>{message.content}</Markdown>
                    </div>
                ))}
            </div>
            <div id="input-container" className="flex gap-2">
                <input type="text" placeholder="Type your message here..." className="flex-1 border border-gray-300 rounded-md p-2" value={message} onChange={(e) => setMessage(e.target.value)} onKeyUp={(e) => e.key === "Enter" && handleSend()} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSend} disabled={generating}>{generating ? "Generating..." : "Send"}</button>
            </div>
        </div>
    )
}