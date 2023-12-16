
export class Message {
    content: string;
    datetime: Date;
    senderUser: User;
    receiverUser: User;
}


export class User{
    id: number;
    name: string;
    username: string;
}

export class ApiResponse{
    message: string;
    response: User[];
    status: string;
}
