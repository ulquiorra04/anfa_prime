import type { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}

const InfoRow = ({ icon: Icon, label, value, accent = false }: InfoRowProps) => (
  <div className="flex items-center gap-4 rounded-xl border border-[#ccdfe9] bg-[#f4f9fd] px-4 py-3.5 dark:border-[#1a2d3e] dark:bg-[#0a1520] transition-colors duration-200">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
        accent
          ? "bg-[#e6fff9] text-[#02c39a] dark:bg-[#00271f] dark:text-[#46fdd5]"
          : "bg-[#eaf4fb] text-[#2a7db5] dark:bg-[#01151d] dark:text-[#64b6e0]"
      }`}
    >
      <Icon size={15} strokeWidth={1.8} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#7a9baf] dark:text-[#5c85a0]">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-[#0d2233] dark:text-[#ddeef7]">
        {value}
      </p>
    </div>
  </div>
);

export default InfoRow;