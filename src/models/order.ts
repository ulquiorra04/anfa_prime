import type { MealsDto } from "./meal";
import type { MenuDto } from "./menu";

export interface OrderDto {
    commande_id: number;
    meal: MealsDto;
    menu: MenuDto;
    status: number;
    created_at: string;
}



