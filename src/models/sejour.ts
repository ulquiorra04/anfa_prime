import type { OrderDto } from "./order";

export interface sejourDto {
    sejour_id: number;
    sejour: string;
    name: string;
    orders: OrderDto[];
}