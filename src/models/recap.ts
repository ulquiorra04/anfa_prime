import type { MealsDto } from "./meal";
import type { MenuDto } from "./menu";

export interface RecapState {
  username?: string;
  meal?: MealsDto;
  menu?: MenuDto;
}
