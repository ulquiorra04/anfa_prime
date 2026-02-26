import type { LucideIcon } from "lucide-react";

interface CourseTagProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

const CourseTag = ({ icon: Icon, label, value, color }: CourseTagProps) => (
  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${color} transition-colors duration-200`}>
    <Icon size={14} strokeWidth={1.8} className="shrink-0 opacity-80" />
    <div className="min-w-0">
      <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] opacity-60">
        {label} ·{" "}
      </span>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  </div>
);

export default CourseTag;