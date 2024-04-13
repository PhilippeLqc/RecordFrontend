import { Hierarchy } from "../enumTypes/hierarchy";
import { Status } from "../enumTypes/status";

export interface TaskDto {
    taskId: number;
    title: string;
    description: string;
    position: number;
    expirationDate: Date;
    status: Status;
    hierarchy: Hierarchy;
    listUserId: number[];
    boardlistId: number;
}