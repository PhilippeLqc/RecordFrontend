import { Hierarchy } from "../enumTypes/hierarchy";
import { StatusTask } from "../enumTypes/statusTask";

export interface TaskDto {
    taskId: number;
    title: string;
    description: string;
    position: number;
    expirationDate: Date;
    status: StatusTask;
    hierarchy: Hierarchy;
    listUserId: number[];
    boardlistId: number;
}