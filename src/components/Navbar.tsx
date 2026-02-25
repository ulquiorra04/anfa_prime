import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import type { sejourDto } from "@/models/sejour";
import { Switch } from "./ui/switch";
import { Sun, Moon, Stethoscope, Globe } from "lucide-react"; // Added Globe icon
import axios from "axios";
import { useTranslation } from "react-i18next"; // 1. Import hook

export default function Navbar() {
  const { t, i18n } = useTranslation(); // 2. Initialize translation
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("ThemeContext undefined");

  const [sejour, setSejour] = useState<sejourDto | null>(null);
  const { darkMode, toggleTheme } = theme;

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const fetchSejour = async () => {
      try {
        const response = await axios.get<sejourDto>(
          `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_HISTORY}`
        );
        setSejour(response.data);
      } catch (error) {
        console.error("Error fetching sejour", error);
      }
    };
    fetchSejour();
  }, []);

  const formatName = (name: string) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // 4. Function to cycle through languages (or you can use a dropdown)
  const toggleLanguage = () => {
    const langs = ['en', 'fr', 'ar'];
    const nextLang = langs[(langs.indexOf(i18n.language) + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#dde8f0] bg-white/90 backdrop-blur-md dark:border-[#1e2f3d] dark:bg-[#0d1b26]/92 transition-colors duration-300">
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between gap-4 px-5 md:h-17 md:px-8">

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#bdd9ee] bg-[#eaf4fb] dark:border-[#1e3d52] dark:bg-[#0e2233]">
            <Stethoscope size={17} className="text-[#2a7db5]" strokeWidth={1.8} />
          </div>

          <div className="flex min-w-0 flex-col">
            {/* 5. Translate "Welcome back" */}
            <span className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7a9baf] sm:block">
              {t('welcome_back')}
            </span>
            <span className="truncate text-lg font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-xl md:text-2xl ">
              {sejour?.name ? (
                <em className="not-italic text-[#2a7db5]">{formatName(sejour.name)}</em>
              ) : (
                t('your_menu') // 6. Translate "Your Menu"
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 7. Language Switcher Button */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full border border-[#dde8f0] bg-[#f2f8fc] px-3 py-1.5 dark:border-[#1e2f3d] dark:bg-[#0e1e2b] hover:bg-[#e6f0f7] transition-colors"
          >
            <Globe size={13} className="text-[#2a7db5]" />
            <span className="text-xs font-bold uppercase text-[#5c85a0]">{i18n.language}</span>
          </button>

          {/* Theme Switcher */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#dde8f0] bg-[#f2f8fc] px-3 py-1.5 dark:border-[#1e2f3d] dark:bg-[#0e1e2b]">
            {darkMode ? <Moon size={13} className="text-[#7a9baf]" /> : <Sun size={13} className="text-[#2a7db5]" />}
            <span className="hidden text-xs font-medium text-[#5c85a0] dark:text-[#7a9baf] sm:block">
              {darkMode ? t('night') : t('day')}
            </span>
            <Switch
              checked={darkMode}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-[#2a7db5] data-[state=unchecked]:bg-[#b8d4e6] dark:data-[state=unchecked]:bg-[#1e3248]"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-t bg-gradient-to-r from-[#64b6e0] to-[#2a7db5]" />
    </nav>
  );
}