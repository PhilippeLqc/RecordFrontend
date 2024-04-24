import { Status } from "../enumTypes/status";


export interface ProjectDto {
    id: number;
    title: string;
    description: string;
    backgroundStyle: string;
    status: Status,
    boardlistIds: number[],
    userIds: number[]
}