"use client"

import { useState } from "react";

export default function Chat() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
    const [message, setMessage] = useState("");
    const [generating, setGenerating] = useState(false);

    const handleSend = () => {
        setMessage("");
        setGenerating(true);
        setMessages([...messages, { role: "user", content: message }]);
        console.log(messages);
        setTimeout(() => {
            setGenerating(false);
        }, 1000);
    }

    return (
        <div className="flex-1 p-4 flex flex-col max-w-3xl mx-auto">
            <div id="chat-container" className="flex flex-col h-full gap-2 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`${message.role === "user" ? "text-black self-end" : "text-black self-start"} p-2 rounded-md bg-gray-200 max-w-2/3`}>
                        {message.content}
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