import { Coffee, Pizza, Soup } from "lucide-react";
import type { MenuDto } from "./menu";

export interface MealDto {
  id: number;
  name: string;
  description?: string;
  duration?: string;
  servings?: number;
  menus?: MenuDto[];
}


export const CATEGORIES = [
  {
    tag: 'Morning',
    title: 'Breakfast',
    description: 'Rise & dine with morning favourites',
    Icon: Coffee,
    bar: 'from-[#bbfff8] to-[#02c39a]',
    iconBg: 'bg-[#e6fff9] dark:bg-[#00271f]',
    iconBorder: 'border-[#76fff1] dark:border-[#01765d]',
    iconColor: 'text-[#02c39a] dark:text-[#46fdd5]',
    hoverItem: 'hover:bg-[#e6fff9] dark:hover:bg-[#00271f]',
    arrowColor: '#02c39a',
  },
  {
    tag: 'Midday',
    title: 'Lunch',
    description: 'Light, bright midday plates',
    Icon: Soup,
    bar: 'from-[#00a896] to-[#028090]',
    iconBg: 'bg-[#e0f9f7] dark:bg-[#001a1d]',
    iconBorder: 'border-[#70ecfd] dark:border-[#014d57]',
    iconColor: 'text-[#028090] dark:text-[#29e3fc]',
    hoverItem: 'hover:bg-[#e0f9f7] dark:hover:bg-[#001a1d]',
    arrowColor: '#028090',
  },
  {
    tag: 'Evening',
    title: 'Dinner',
    description: 'Indulgent evenings worth savouring',
    Icon: Pizza,
    bar: 'from-[#05668d] to-[#f0f3bd]',
    iconBg: 'bg-[#e8f4fb] dark:bg-[#01151d]',
    iconBorder: 'border-[#73d4fa] dark:border-[#033e56]',
    iconColor: 'text-[#05668d] dark:text-[#2dbef7]',
    hoverItem: 'hover:bg-[#e8f4fb] dark:hover:bg-[#01151d]',
    arrowColor: '#05668d',
  },
];