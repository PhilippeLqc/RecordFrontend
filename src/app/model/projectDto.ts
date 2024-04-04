import { Status } from "../enumTypes/status";


export interface ProjectDto {
    id: number;
    title: string;
    description: string;
    status: Status
}