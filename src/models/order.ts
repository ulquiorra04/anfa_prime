import type { MealDto } from "./meal";
import type { MenuDto } from "./menu";

export interface OrderDto {
    id: number;
    meal: MealDto;
    menu: MenuDto;
    status: number;
}