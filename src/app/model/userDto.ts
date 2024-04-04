import { role } from "../enumTypes/role";

export interface UserDto {
    id: number;
    username: string;
    email: string;
    role: role;
    taskIds: number[];
    projectIds: number[];
    messageIds: number[];
}