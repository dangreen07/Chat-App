"use client"

import { useState } from "react";
import Markdown from "react-markdown";

export default function Chat() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
    const [message, setMessage] = useState("");
    const [generating, setGenerating] = useState(false);

    const handleSend = async () => {
        // Prevent empty submissions
        if (!message.trim()) return;

        // Add the user's message to the local state first
        const newMessages = [...messages, { role: "user" as const, content: message }];
        setMessages(newMessages);
        setMessage("");
        setGenerating(true);

        // Make the request to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: newMessages }),
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