import Link from "next/link"
import { FaRegEdit } from "react-icons/fa"
import { Sidebar, SidebarContent, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";

type Chat = {
    id: string
    chat_name: string
    created_at: string
    updated_at: string
}

export default async function AppSidebar() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`)
    const data = await res.json() as { chats: Chat[] }

    const chats = data.chats

    return (
        <Sidebar id="sidebar" collapsible="icon" variant="sidebar">
            <SidebarHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-bold group-data-[collapsible=icon]:hidden">Chat App</h2>
                <SidebarTrigger className="size-7" />
            </SidebarHeader>
            <SidebarContent>
                <Link href="/">
                    <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
                        <FaRegEdit className="w-4 h-4" />
                        <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
                    </Button>
                </Link>
                <SidebarGroupLabel className="text-lg font-bold group-data-[collapsible=icon]:hidden">Chats</SidebarGroupLabel>
                <SidebarGroupContent className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden group-data-[collapsible=icon]:hidden">
                    {chats.map((chat) => (
                        <Link href={`/chat/${chat.id}`} key={chat.id}>
                            <Button variant="ghost" className="w-full justify-start">
                                <span>{chat.chat_name}</span>
                            </Button>
                        </Link>
                    ))}
                </SidebarGroupContent>
            </SidebarContent>
        </Sidebar>
    )
}