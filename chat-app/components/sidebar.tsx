"use client"

import Link from "next/link"
import { FaRegEdit } from "react-icons/fa"
import { Sidebar, SidebarContent, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";

export default function AppSidebar() {
    const sampleChats = [
        {
            id: "hsadjsamsadjs",
            title: "Recipes for dinner"
        },
        {
            id: "asdjasdjasd",
            title: "Best restaurants in United Kingdom"
        },
        {
            id: "asdsashadsd",
            title: "Stripy purple cat"
        }
    ]

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
                    {sampleChats.map((chat) => (
                        <Link href={`/chat/${chat.id}`} key={chat.id}>
                            <Button variant="ghost" className="w-full justify-start">
                                <span>{chat.title}</span>
                            </Button>
                        </Link>
                    ))}
                </SidebarGroupContent>
            </SidebarContent>
        </Sidebar>
    )
}