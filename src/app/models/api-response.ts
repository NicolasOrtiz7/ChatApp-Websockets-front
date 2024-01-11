import { Chat } from "./chat";
import { Message } from "./message";

export class ApiResponse {
    chat: Chat
    messages: Message[];
}
