import { Hierarchy } from "../enumTypes/hierarchy";
import { Status } from "../enumTypes/status";

export interface TaskDto {
    id: number;
    title: string;
    description: string;
    expirationDate: Date;
    status: Status;
    hierarchy: Hierarchy;
    userId: number[];
    boardListId: number;
}