import { User } from "./user";





export class ApiResponse{
    message: string;
    response: any;
    status: string;
}

export class ApiResponseUsers{
    message: string;
    response: User[];
    status: string;
}

export class ApiResponseMessages{
    message: string;
    response: any;
    status: string;
}