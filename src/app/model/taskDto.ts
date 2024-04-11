import { Hierarchy } from "../enumTypes/hierarchy";
import { Status } from "../enumTypes/status";

export interface TaskDto {
    taskId: number;
    title: string;
    description: string;
    expirationDate: Date;
    status: Status;
    hierarchy: Hierarchy;
    userId: number[];
    boardlistId: number;
}