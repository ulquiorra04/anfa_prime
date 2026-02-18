import type { MenuBody } from "./menuBody";

export interface MenuDto {
  id: number;
  name: string;
  body: MenuBody;
}

export const TAB_THEMES = [
  {
    bar:     "from-[#bbfff8] to-[#02c39a]",
    active:  "text-[#02c39a] dark:text-[#46fdd5]",
    activeBg: "bg-white dark:bg-[#0d1e2d]",
    activeIndicator: "bg-[#02c39a]",
    entree:  "bg-[#e6fff9] text-[#02c39a] dark:bg-[#00271f] dark:text-[#46fdd5]",
    plat:    "bg-[#c1fef1] text-[#00a896] dark:bg-[#00433d] dark:text-[#32ffea]",
    dessert: "bg-[#76fff1] text-[#028090] dark:bg-[#014d57] dark:text-[#29e3fc]",
    btn:     "bg-[#02c39a] hover:bg-[#01a882] shadow-[#02c39a]/25",
    dot:     "bg-[#02c39a]",
  },
  {
    bar:     "from-[#00a896] to-[#028090]",
    active:  "text-[#028090] dark:text-[#29e3fc]",
    activeBg: "bg-white dark:bg-[#0d1e2d]",
    activeIndicator: "bg-[#028090]",
    entree:  "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]",
    plat:    "bg-[#b8f6fe] text-[#026775] dark:bg-[#01343a] dark:text-[#70ecfd]",
    dessert: "bg-[#70ecfd] text-[#014d57] dark:bg-[#01343a] dark:text-[#03c0d9]",
    btn:     "bg-[#028090] hover:bg-[#026775] shadow-[#028090]/25",
    dot:     "bg-[#028090]",
  },
  {
    bar:     "from-[#05668d] to-[#f0f3bd]",
    active:  "text-[#05668d] dark:text-[#2dbef7]",
    activeBg: "bg-white dark:bg-[#0d1e2d]",
    activeIndicator: "bg-[#05668d]",
    entree:  "bg-[#e8f4fb] text-[#05668d] dark:bg-[#01151d] dark:text-[#2dbef7]",
    plat:    "bg-[#b9e9fc] text-[#045372] dark:bg-[#022a39] dark:text-[#73d4fa]",
    dessert: "bg-[#f0f3bd] text-[#8d931b] dark:bg-[#46490d] dark:text-[#d0d82c]",
    btn:     "bg-[#05668d] hover:bg-[#045372] shadow-[#05668d]/25",
    dot:     "bg-[#05668d]",
  },
] as const;