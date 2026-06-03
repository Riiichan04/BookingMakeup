"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@stomp/stompjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Phone, Video, MoreVertical, Plus, Image as ImageIcon, Smile } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { chatService } from "@/services/chat-service";

interface ChatFormValues {
    content: string;
}

interface ChatBoxProps {
    currentUserId: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    apiUrl: string;
}

export default function ChatBox({ currentUserId, recipientId, recipientName, recipientAvatar, apiUrl }: ChatBoxProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const roomId = currentUserId.localeCompare(recipientId) < 0
        ? `${currentUserId}_${recipientId}`
        : `${recipientId}_${currentUserId}`;

    const { register, handleSubmit, reset } = useForm<ChatFormValues>({
        defaultValues: { content: "" },
    });

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const loadHistoryMessages = async () => {
            if (!currentUserId || !recipientId || currentUserId === "undefined" || recipientId === "undefined") {
                return;
            }

            try {
                const response = await chatService.getChatMessages(apiUrl, currentUserId, recipientId, 0, 50);
                if (response && response.content) {
                    const orderedMessages = [...response.content].reverse();
                    setMessages(orderedMessages);
                }
            } catch (error) {
                console.error("Failed to load history messages:", error);
                setMessages([]);
            }
        };

        loadHistoryMessages();
    }, [roomId, apiUrl, currentUserId, recipientId]);

    useEffect(() => {
        const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws";

        const client = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);

                client.subscribe(`/user/${currentUserId}/queue/messages`, (message) => {
                    if (message.body) {
                        const receivedMessage: ChatMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, receivedMessage]);

                        client.publish({
                            destination: "/app/chat.read",
                            body: JSON.stringify({
                                chatId: roomId,
                                senderId: receivedMessage.sender.id,
                                recipientId: currentUserId
                            })
                        });
                    }
                });
            },
            onDisconnect: () => setIsConnected(false),
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [currentUserId, recipientId, apiUrl, roomId]);

    const onSendMessage = (data: ChatFormValues) => {
        if (!data.content.trim() || !stompClientRef.current?.connected) return;

        const chatDto = {
            chatId: roomId,
            senderId: currentUserId,
            recipientId: recipientId,
            content: data.content,
        };

        stompClientRef.current.publish({
            destination: "/app/chat",
            body: JSON.stringify(chatDto),
        });

        const localMessage: ChatMessage = {
            content: data.content,
            sender: { id: currentUserId, username: "Me" },
            recipient: { id: recipientId, username: recipientName },
            status: "SENT",
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, localMessage]);
        reset();
    };

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA]">
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="w-10 h-10 border">
                            <AvatarImage src={recipientAvatar} alt={recipientName} className="object-cover" />
                            <AvatarFallback className="bg-pink-100 text-[#E4187D] font-bold">
                                {recipientName ? recipientName[0].toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isConnected ? "bg-green-500" : "bg-red-400 animate-pulse"
                            }`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">{recipientName}</h3>
                        <p className={`text-[11px] font-semibold ${isConnected ? "text-green-500" : "text-gray-400"}`}>
                            {isConnected ? "ĐANG HOẠT ĐỘNG" : "ĐANG KẾT NỐI LẠI..."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Button variant="ghost" size="icon" className="text-[#E4187D] hover:bg-pink-50 rounded-full"><Phone className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" className="text-[#E4187D] hover:bg-pink-50 rounded-full"><Video className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="text-center text-[10px] bg-gray-100 text-gray-400 rounded-md py-1 px-3 w-max mx-auto mb-6 font-bold tracking-wider">HÔM NAY</div>

                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isMe = msg.sender.id === currentUserId;
                        return (
                            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${isMe ? "bg-[#E4187D] text-white rounded-br-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                                    }`}>
                                    <p className="break-all">{msg.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSendMessage)(e);
                    }}
                    className="flex items-center gap-3 bg-[#F3F4F6] px-4 py-2 rounded-full"
                >
                    <div className="flex items-center gap-2 text-gray-400 shrink-0">
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-gray-200"><Plus className="w-5 h-5" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-gray-200"><ImageIcon className="w-5 h-5" /></Button>
                    </div>

                    <Input
                        {...register("content")}
                        placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối lại..."}
                        disabled={!isConnected}
                        autoComplete="off"
                        className="flex-1 bg-transparent border-none p-0 h-8 shadow-none focus-visible:ring-0 text-sm placeholder:text-gray-400 text-gray-800"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                        <Button type="button" variant="ghost" size="icon" className="w-8 h-8 text-gray-400 rounded-full hover:bg-gray-200"><Smile className="w-5 h-5" /></Button>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!isConnected}
                            className="w-9 h-9 rounded-full bg-[#E4187D] hover:bg-[#c9126b] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}