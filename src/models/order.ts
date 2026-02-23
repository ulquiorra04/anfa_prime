import type { MealsDto } from "./meal";
import type { MenuDto } from "./menu";

export interface OrderDto {
    id: number;
    meal: MealsDto;
    menu: MenuDto;
    status: number;
    created_at: string;
}



