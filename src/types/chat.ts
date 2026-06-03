export interface ChatMessage {
    id?: string;
    sender: { id: string; username: string };
    recipient: { id: string; username: string };
    content: string;
    status: "SENT" | "DELIVERED" | "READ";
    timestamp: string;
}

export interface ChatRoom {
    id: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
}