import { User } from "./user";

export class Message {
    content: string;
    datetime: Date;
    senderUser: User;
    receiverUser: User;
}