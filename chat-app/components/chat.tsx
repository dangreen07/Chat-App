"use client"

import { useState } from "react";
import Markdown from "react-markdown";

export default function Chat() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
    const [message, setMessage] = useState("");
    const [generating, setGenerating] = useState(false);

    const handleSend = async () => {
        setMessage("");
        setGenerating(true);
        const newMessages = [...messages, { role: "user" as const, content: message }];
        setMessages(newMessages);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
            method: "POST",
            body: JSON.stringify({ messages: newMessages }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json();
        setMessages([...newMessages, { role: "assistant" as const, content: data.message }]);
        setTimeout(() => {
            setGenerating(false);
        }, 1000);
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