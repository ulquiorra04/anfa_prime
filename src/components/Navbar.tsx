import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import type { sejourDto } from "@/models/sejour";
import { Switch } from "./ui/switch";
import { Sun, Moon, Stethoscope } from "lucide-react";

export default function Navbar() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("ThemeContext undefined");

  const [sejour, setSejour] = useState<sejourDto | null>(null);
  const { darkMode, toggleTheme } = theme;

  useEffect(() => {
    const fetchSejour = async () => {
      try {
        const response = await fetch("data/sejour.json");
        const data = await response.json();
        setSejour(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSejour();
  }, []);

  // Fonction pour formater le nom (première lettre en majuscule, reste en minuscules)
  const formatName = (name: string) => {
    if (!name) return "";
    
    return name
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word
          .split('-')
          .map(part => {
            if (part.length === 0) return part;
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          })
          .join('-');
      })
      .join(' ');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#dde8f0] bg-white/90 backdrop-blur-md dark:border-[#1e2f3d] dark:bg-[#0d1b26]/92 transition-colors duration-300 relative">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 px-5 md:h-[68px] md:px-8">

        {/* ── Brand ── */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#bdd9ee] bg-[#eaf4fb] dark:border-[#1e3d52] dark:bg-[#0e2233]">
            <Stethoscope size={17} className="text-[#2a7db5]" strokeWidth={1.8} />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7a9baf] sm:block">
              Welcome back
            </span>
            <span className="truncate text-lg font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-xl md:text-2xl ">
              {sejour?.name ? (
                <em className="not-italic text-[#2a7db5]">{formatName(sejour.name)}</em>
              ) : (
                "Your Menu"
              )}
            </span>
          </div>
        </div>

        {/* ── Theme Toggle ── */}
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#dde8f0] bg-[#f2f8fc] px-3 py-1.5 dark:border-[#1e2f3d] dark:bg-[#0e1e2b]">
          {darkMode ? (
            <Moon size={13} className="text-[#7a9baf]" strokeWidth={1.8} />
          ) : (
            <Sun size={13} className="text-[#2a7db5]" strokeWidth={1.8} />
          )}
          <span className="hidden text-xs font-medium text-[#5c85a0] dark:text-[#7a9baf] sm:block">
            {darkMode ? "Night" : "Day"}
          </span>
          <Switch
            checked={darkMode}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-[#2a7db5] data-[state=unchecked]:bg-[#b8d4e6] dark:data-[state=unchecked]:bg-[#1e3248]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          />
        </div>
      </div>

      {/* Bottom calm-blue accent line */}
      <div className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-t bg-gradient-to-r from-[#64b6e0] to-[#2a7db5]" />
    </nav>
  );
}