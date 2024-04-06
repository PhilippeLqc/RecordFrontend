import { Status } from "../enumTypes/status";

export interface Project {
    id: number;
    title: string;
    description: string;
    status: Status;
    boardlistIds: [];
    userIds: [];
}