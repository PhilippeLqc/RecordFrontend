export interface UserRegisterDto {
    username: string;
    email: string;
    password: string;
    role: string;
    taskIds: number[];
    projectIds: number[];
    messageIds: number[];
}