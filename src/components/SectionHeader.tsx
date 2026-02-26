import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
}

const SectionHeader = ({ icon: Icon, label }: SectionHeaderProps) => (
  <div className="mb-3 flex items-center gap-2">
    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eaf4fb] dark:bg-[#01151d]">
      <Icon size={11} className="text-[#2a7db5] dark:text-[#64b6e0]" />
    </div>
    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#7a9baf]">
      {label}
    </p>
  </div>
);

export default SectionHeader;