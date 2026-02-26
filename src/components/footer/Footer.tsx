import { useTranslation } from "react-i18next";
import './Footer.scss';

export default function Footer() {
  const { t } = useTranslation();

  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full mt-auto overflow-hidden ">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#2a7db5]/40 to-transparent" />

      <div className="bg-[#f0f7fc]/80 dark:bg-[#0a1520]/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4a7a9b] dark:text-[#4a7a9b]">
          <span className="tracking-wide">
            © {year}{" "}
            <span className="text-[#2a7db5] font-semibold">Anfa Prime</span>
          </span>

          <span className="hidden sm:block w-1 h-1 rounded-full bg-[#2a7db5]/30" />
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a7db5] animate-pulse" />
            <span className="tracking-widest uppercase font-medium text-[10px]">
              {t("version")}
            </span>
            <em className="not-italic font-bold text-[#2a7db5] tracking-wide"> { import.meta.env.VITE_VERSION } </em>
          </span>
        </div>
      </div>
    </footer>
  );
}
