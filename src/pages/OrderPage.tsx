import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { OrderDto } from "../models/order";
import {
  Coffee, CheckCircle, Clock, XCircle,
  Utensils, Plus, ClipboardList, ChevronRight, Sparkles,
  Soup, Pizza, CalendarDays, ChevronLeft, X,
} from "lucide-react";

/* ── Helpers ──────────────────────────────────────────────────────────── */
// Normalize to local midnight — fixes UTC ISO strings shifting to wrong day in local timezone
const toMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isSameDay = (a: Date, b: Date) =>
  toMidnight(a).getTime() === toMidnight(b).getTime();

const isInRange = (d: Date, from: Date, to: Date) => {
  const t = toMidnight(d).getTime();
  return t >= toMidnight(from).getTime() && t <= toMidnight(to).getTime();
};

const formatDayShort = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const formatDayLabel = (d: Date) =>
  d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const formatTime = (raw: string) => {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const toDate = (raw: string) => new Date(raw);

const MONTH_NAMES = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const MONTH_SHORT = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];
const DAY_HEADERS = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

type Mode = "single" | "range";
type Step = "year" | "month" | "day";

/* ── DrillDown Calendar ──────────────────────────────────────────────── */
function DrillCalendar({
  mode,
  selected,
  rangeStart,
  rangeEnd,
  onSelectSingle,
  onSelectRange,
  activeDates,
}: {
  mode: Mode;
  selected: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onSelectSingle: (d: Date | null) => void;
  onSelectRange: (s: Date | null, e: Date | null) => void;
  activeDates: Date[];
}) {
  const today = new Date();
  const [step, setStep] = useState<Step>("year");
  const [pickedYear, setPickedYear] = useState(today.getFullYear());
  const [pickedMonth, setPickedMonth] = useState(today.getMonth());
  const [yearPage, setYearPage] = useState(0); // page of 12 years
  const [hovered, setHovered] = useState<Date | null>(null);

  // Years grid: current decade-ish, 12 per page
  const YEARS_PER_PAGE = 12;
  const baseYear = today.getFullYear() - 5 + yearPage * YEARS_PER_PAGE;
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => baseYear + i);

  // Active year/month checks
  const hasOrderInYear = (y: number) => activeDates.some((d) => d.getFullYear() === y);
  const hasOrderInMonth = (y: number, m: number) =>
    activeDates.some((d) => d.getFullYear() === y && d.getMonth() === m);
  const hasOrderOnDay = (d: Date) => activeDates.some((ad) => isSameDay(ad, d));

  // Day grid
  const firstDay = new Date(pickedYear, pickedMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(pickedYear, pickedMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(pickedYear, pickedMonth, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDayClick = (d: Date) => {
    if (mode === "single") {
      onSelectSingle(selected && isSameDay(selected, d) ? null : d);
    } else {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        onSelectRange(d, null);
      } else {
        if (isSameDay(d, rangeStart)) { onSelectRange(null, null); return; }
        if (d < rangeStart) onSelectRange(d, rangeStart);
        else onSelectRange(rangeStart, d);
      }
    }
  };

  const getDayStyle = (d: Date) => {
    if (mode === "single") {
      if (selected && isSameDay(selected, d)) return "selected";
      if (isSameDay(d, today)) return "today";
      return "normal";
    }
    const effectiveEnd = rangeEnd ?? hovered;
    const from = rangeStart && effectiveEnd
      ? (rangeStart <= effectiveEnd ? rangeStart : effectiveEnd) : rangeStart;
    const to = rangeStart && effectiveEnd
      ? (rangeStart <= effectiveEnd ? effectiveEnd : rangeStart) : null;

    if (rangeStart && isSameDay(d, rangeStart)) return "selected";
    if (rangeEnd && isSameDay(d, rangeEnd)) return "selected";
    if (!rangeEnd && hovered && rangeStart && isSameDay(d, hovered)) return "range-end-hover";
    if (from && to && isInRange(d, from, to)) return "in-range";
    if (isSameDay(d, today)) return "today";
    return "normal";
  };

  const stepLabel = step === "year"
    ? `${baseYear} – ${baseYear + YEARS_PER_PAGE - 1}`
    : step === "month"
    ? `${pickedYear}`
    : `${MONTH_NAMES[pickedMonth]} ${pickedYear}`;

  const goBack = () => {
    if (step === "month") setStep("year");
    else if (step === "day") setStep("month");
  };

  const clearAll = () => { onSelectSingle(null); onSelectRange(null, null); };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-xl dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">

      {/* ── Nav bar ── */}
      <div className="flex items-center gap-2 border-b border-[#e8f0f6] px-3 py-2.5 dark:border-[#1a2d3e]">
        {step !== "year" && (
          <button
            onClick={goBack}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        <button
          onClick={() => { if (step !== "year") setStep(step === "day" ? "month" : "year"); }}
          className={`flex-1 text-center text-xs font-bold text-[#0d2233] transition-colors dark:text-[#ddeef7]
            ${step !== "year" ? "hover:text-[#2a7db5] cursor-pointer" : "cursor-default"}`}
        >
          {stepLabel}
        </button>

        {/* Year page prev/next — only on year step */}
        {step === "year" && (
          <div className="flex gap-1">
            <button
              onClick={() => setYearPage((p) => p - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setYearPage((p) => p + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Month prev/next — only on day step */}
        {step === "day" && (
          <div className="flex gap-1">
            <button
              onClick={() => {
                if (pickedMonth === 0) { setPickedMonth(11); setPickedYear((y) => y - 1); }
                else setPickedMonth((m) => m - 1);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => {
                if (pickedMonth === 11) { setPickedMonth(0); setPickedYear((y) => y + 1); }
                else setPickedMonth((m) => m + 1);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-2">
        <AnimatePresence mode="wait">

          {/* YEAR grid */}
          {step === "year" && (
            <motion.div
              key="year"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-4 gap-1"
            >
              {years.map((y) => {
                const active = hasOrderInYear(y);
                const isCurrent = y === today.getFullYear();
                const isPicked = y === pickedYear;
                return (
                  <button
                    key={y}
                    onClick={() => { setPickedYear(y); setStep("month"); }}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={`
                      relative flex flex-col items-center justify-center rounded-xl py-2.5 text-xs font-semibold
                      transition-all duration-150 min-h-[44px]
                      ${isPicked
                        ? "bg-[#2a7db5] text-white shadow-md"
                        : isCurrent
                        ? "border border-[#2a7db5]/40 text-[#2a7db5] dark:text-[#5b9ec9]"
                        : "text-[#0d2233] hover:bg-[#f0f8ff] dark:text-[#ddeef7] dark:hover:bg-[#0f2235]"
                      }
                    `}
                  >
                    {y}
                    {active && (
                      <span className={`mt-0.5 h-1 w-1 rounded-full ${isPicked ? "bg-white/70" : "bg-[#2a7db5] dark:bg-[#5b9ec9]"}`} />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* MONTH grid */}
          {step === "month" && (
            <motion.div
              key="month"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-3 gap-1"
            >
              {MONTH_SHORT.map((name, m) => {
                const active = hasOrderInMonth(pickedYear, m);
                const isCurrent = m === today.getMonth() && pickedYear === today.getFullYear();
                const isPicked = m === pickedMonth;
                return (
                  <button
                    key={m}
                    onClick={() => { setPickedMonth(m); setStep("day"); }}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={`
                      relative flex flex-col items-center justify-center rounded-xl py-3 text-xs font-semibold
                      transition-all duration-150 min-h-[44px]
                      ${isPicked
                        ? "bg-[#2a7db5] text-white shadow-md"
                        : isCurrent
                        ? "border border-[#2a7db5]/40 text-[#2a7db5] dark:text-[#5b9ec9]"
                        : active
                        ? "text-[#0d2233] dark:text-[#ddeef7] hover:bg-[#f0f8ff] dark:hover:bg-[#0f2235]"
                        : "text-[#aabdcb] dark:text-[#3a4d5e] hover:bg-[#f0f8ff] dark:hover:bg-[#0f2235]"
                      }
                    `}
                  >
                    {name}
                    {active && (
                      <span className={`mt-0.5 h-1 w-1 rounded-full ${isPicked ? "bg-white/70" : "bg-[#2a7db5] dark:bg-[#5b9ec9]"}`} />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* DAY grid */}
          {step === "day" && (
            <motion.div
              key="day"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_HEADERS.map((d) => (
                  <div key={d} className="py-1 text-center text-[0.55rem] font-bold uppercase tracking-widest text-[#7a9baf]">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} className="min-h-[32px]" />;
                  const s = getDayStyle(d);
                  const active = hasOrderOnDay(d);

                  return (
                    <button
                      key={i}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => mode === "range" && setHovered(d)}
                      onMouseLeave={() => mode === "range" && setHovered(null)}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                      className={`
                        relative flex flex-col items-center justify-center min-h-[32px]
                        text-[0.7rem] font-semibold transition-all duration-100
                        ${s === "selected"    ? "rounded-lg bg-[#2a7db5] text-white shadow-md z-10" : ""}
                        ${s === "range-end-hover" ? "rounded-lg bg-[#2a7db5]/60 text-white" : ""}
                        ${s === "in-range"    ? "bg-[#2a7db5]/12 text-[#2a7db5] dark:bg-[#2a7db5]/20 dark:text-[#5b9ec9]" : ""}
                        ${s === "today"       ? "rounded-lg border border-[#2a7db5]/50 text-[#2a7db5] dark:text-[#5b9ec9]" : ""}
                        ${s === "normal"      ? "rounded-lg text-[#0d2233] hover:bg-[#f0f8ff] dark:text-[#ddeef7] dark:hover:bg-[#0f2235]" : ""}
                      `}
                    >
                      {d.getDate()}
                      {active && (
                        <span className={`absolute bottom-0.5 h-[3px] w-[3px] rounded-full
                          ${s === "selected" ? "bg-white/70" : "bg-[#2a7db5] dark:bg-[#5b9ec9]"}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {(selected || rangeStart) && (
        <div className="border-t border-[#e8f0f6] px-3 py-2 dark:border-[#1a2d3e]">
          <button
            onClick={clearAll}
            className="w-full text-center text-[0.65rem] font-medium text-[#5c85a0] transition-colors hover:text-[#2a7db5] dark:text-[#7a9baf]"
          >
            Effacer le filtre
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [calOpen, setCalOpen] = useState(false);
  const [calMode, setCalMode] = useState<Mode>("single");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const sj = await (await fetch("data/sejour.json")).json();
        if (sj) setOrders(sj.orders);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const activeDates = useMemo(
    () => orders.map((o) => toDate(o.created_at)).filter((d) => !isNaN(d.getTime())),
    [orders],
  );

  const hasFilter = calMode === "single" ? !!selectedDay : !!rangeStart;

  const filterLabel = useMemo(() => {
    if (calMode === "single" && selectedDay) return formatDayShort(selectedDay);
    if (calMode === "range" && rangeStart && rangeEnd)
      return `${formatDayShort(rangeStart)} → ${formatDayShort(rangeEnd)}`;
    if (calMode === "range" && rangeStart) return `Depuis ${formatDayShort(rangeStart)}`;
    return null;
  }, [calMode, selectedDay, rangeStart, rangeEnd]);

  const grouped = useMemo(() => {
    const today = new Date();
    let filtered: typeof orders;

    if (calMode === "single" && selectedDay) {
      // Explicit single-day filter selected
      filtered = orders.filter((o) => isSameDay(toDate(o.created_at), selectedDay));
    } else if (calMode === "range" && rangeStart && rangeEnd) {
      // Explicit range filter selected
      const from = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
      const to   = rangeStart <= rangeEnd ? rangeEnd   : rangeStart;
      filtered = orders.filter((o) => isInRange(toDate(o.created_at), from, to));
    } else {
      // Default: only show today's orders
      filtered = orders.filter((o) => isSameDay(toDate(o.created_at), today));
    }

    const map = new Map<string, OrderDto[]>();
    filtered.forEach((o) => {
      const d = toDate(o.created_at);
      // Use zero-padded month+1 (1-12) for correct sort key
      const key = isNaN(d.getTime()) ? "unknown"
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, dayOrders]) => {
        const d = key === "unknown" ? new Date() : toDate(dayOrders[0].created_at);
        return { label: formatDayLabel(d), orders: dayOrders };
      });
  }, [orders, calMode, selectedDay, rangeStart, rangeEnd]);

  const clearFilter = () => { setSelectedDay(null); setRangeStart(null); setRangeEnd(null); };

  const getStatusConfig = (status: number) => ({
    1: { classes: "bg-[#eaf7f1] text-[#1a8c5b] border-[#b3e2cf] dark:bg-[#0a2318] dark:text-[#4dd9a0] dark:border-[#0f3d28]", icon: <CheckCircle className="w-3 h-3" />, label: "Livré" },
    0: { classes: "bg-[#eaf4fb] text-[#1e6fa0] border-[#b3d6ed] dark:bg-[#0a1e2d] dark:text-[#64b6e0] dark:border-[#0f2e44]", icon: <Clock className="w-3 h-3" />, label: "En route" },
    2: { classes: "bg-[#fdf0f0] text-[#b03a3a] border-[#f0c0c0] dark:bg-[#2a0d0d] dark:text-[#f08080] dark:border-[#3d1515]", icon: <XCircle className="w-3 h-3" />, label: "Annulé" },
  } as Record<number, { classes: string; icon: React.ReactNode; label: string }>)[status] ?? {
    classes: "bg-[#f2f8fc] text-[#5c85a0] border-[#ccdfe9] dark:bg-[#0e1e2d] dark:text-[#7a9baf] dark:border-[#1a2d3e]",
    icon: <XCircle className="w-3 h-3" />, label: "Inconnu",
  };

  const getMealMeta = (mealName: string) => {
    const l = mealName.toLowerCase();
    if (l.includes("petit") || l.includes("breakfast")) return { icon: <Coffee className="w-4 h-4" />, color: "bg-[#e6fff9] text-[#02c39a] dark:bg-[#00271f] dark:text-[#46fdd5]", bar: "from-[#bbfff8] to-[#02c39a]", label: "Petit-déjeuner" };
    if (l.includes("déj") || l.includes("dej") || l.includes("lunch")) return { icon: <Soup className="w-4 h-4" />, color: "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]", bar: "from-[#00a896] to-[#028090]", label: "Déjeuner" };
    if (l.includes("dîner") || l.includes("dinner")) return { icon: <Pizza className="w-4 h-4" />, color: "bg-[#e8f4fb] text-[#05668d] dark:bg-[#01151d] dark:text-[#2dbef7]", bar: "from-[#05668d] to-[#f0f3bd]", label: "Dîner" };
    return { icon: <Soup className="w-4 h-4" />, color: "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]", bar: "from-[#2dbef7] to-[#05668d]", label: "Repas" };
  };

  const SkeletonCard = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
      <div className="h-0.5 w-full bg-[#dde8f0] dark:bg-[#1a2d3e]" />
      <div className="flex items-center gap-3 p-5">
        <div className="h-10 w-10 rounded-xl bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
          <div className="h-3 w-1/2 rounded bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
        </div>
        <div className="h-6 w-20 rounded-full bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f9fd] px-4 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:px-5 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
                <ClipboardList size={13} className="text-[#2a7db5]" />
                Vos commandes
              </div>
              <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7]">
                Meal <em className="italic text-[#2a7db5]">History</em>
              </h1>
              <div className="mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
            </div>

            <div className="flex items-center gap-2 self-end">
              {/* Calendar toggle */}
              {!loading && orders.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setCalOpen((v) => !v)}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={`
                      flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold
                      transition-all duration-200 max-w-[180px]
                      ${calOpen || hasFilter
                        ? "border-[#2a7db5] bg-[#2a7db5] text-white shadow-md"
                        : "border-[#ccdfe9] bg-white text-[#5c85a0] hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] hover:text-[#2a7db5] dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#7a9baf]"
                      }
                    `}
                  >
                    <CalendarDays size={14} className="shrink-0" />
                    <span className="truncate">
                      {filterLabel ?? <span className="hidden sm:inline">Filtrer</span>}
                    </span>
                    {hasFilter && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); clearFilter(); setCalOpen(false); }}
                        className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/25 hover:bg-white/40"
                      >
                        <X size={10} />
                      </span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {calOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute right-0 top-full z-50 mt-2 w-[280px]"
                      >
                        {/* Mode toggle */}
                        <div className="mb-2 flex rounded-xl border border-[#ccdfe9] bg-white p-1 shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
                          {(["single", "range"] as Mode[]).map((m) => (
                            <button
                              key={m}
                              onClick={() => { setCalMode(m); setSelectedDay(null); setRangeStart(null); setRangeEnd(null); }}
                              style={{ WebkitTapHighlightColor: "transparent" }}
                              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-150
                                ${calMode === m ? "bg-[#2a7db5] text-white shadow-sm" : "text-[#7a9baf] hover:text-[#5c85a0] dark:hover:text-[#ddeef7]"}`}
                            >
                              {m === "single" ? "Jour" : "Période"}
                            </button>
                          ))}
                        </div>

                        <DrillCalendar
                          mode={calMode}
                          selected={selectedDay}
                          rangeStart={rangeStart}
                          rangeEnd={rangeEnd}
                          onSelectSingle={setSelectedDay}
                          onSelectRange={(s, e) => { setRangeStart(s); setRangeEnd(e); }}
                          activeDates={activeDates}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {!loading && orders.length > 0 && (
                <motion.button
                  onClick={() => navigate("/meal")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden sm:flex items-center gap-2 rounded-xl bg-[#2a7db5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/20 transition-colors hover:bg-[#1e6fa0]"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Nouvelle commande
                </motion.button>
              )}
            </div>
          </div>

          {/* Click-outside overlay */}
          {calOpen && <div className="fixed inset-0 z-40" onClick={() => setCalOpen(false)} />}
        </motion.header>

        {/* Empty state */}
        {!loading && orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
              <Utensils size={32} className="text-[#2a7db5]" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold text-[#0d2233] dark:text-[#ddeef7]">Aucune commande</p>
            <p className="mt-2 max-w-xs text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
              Parcourez le menu du jour et passez votre première commande.
            </p>
            <motion.button
              onClick={() => navigate("/meal")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#2a7db5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/25 transition-colors hover:bg-[#1e6fa0]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <Sparkles size={15} />Voir le menu<ChevronRight size={15} />
            </motion.button>
          </motion.div>

        ) : loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>

        ) : (
          <div className="flex flex-col gap-5">
            {/* No results */}
            <AnimatePresence>
              {grouped.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-10 text-center"
                >
                  <CalendarDays size={28} className="mb-3 text-[#ccdfe9] dark:text-[#1a2d3e]" />
                  <p className="text-sm font-medium text-[#5c85a0] dark:text-[#7a9baf]">
                    {hasFilter ? "Aucune commande sur cette période" : "Aucune commande aujourd'hui"}
                  </p>
                  {!hasFilter && (
                    <p className="mt-1 text-xs text-[#7a9baf] dark:text-[#5c85a0]">
                      Utilisez le filtre pour consulter l'historique
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grouped orders */}
            <motion.div
              key={`grp-${calMode}-${selectedDay?.getTime() ?? 0}-${rangeStart?.getTime() ?? 0}-${rangeEnd?.getTime() ?? 0}`}
              className="flex flex-col gap-6"
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            >
              {grouped.map(({ label, orders: dayOrders }) => (
                <motion.section key={label}
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  <div className="mb-2.5 flex items-center gap-3">
                    <span className="text-xs font-bold capitalize text-[#5c85a0] dark:text-[#7a9baf]">{label}</span>
                    <div className="h-px flex-1 bg-[#dde8f0] dark:bg-[#1a2d3e]" />
                    <span className="text-[0.6rem] font-semibold text-[#7a9baf]">{dayOrders.length} repas</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {dayOrders.map((order) => {
                      const sc = getStatusConfig(order.status);
                      const meal = getMealMeta(order.meal.name);
                      return (
                        <article key={order.id}
                          className="group overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2a7db5]/40 hover:shadow-lg dark:border-[#1a2d3e] dark:bg-[#0d1e2d]"
                        >
                          <div className={`h-0.5 w-full bg-gradient-to-r ${meal.bar}`} />
                          <div className="flex items-center gap-3 px-5 py-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${meal.color}`}>
                              {meal.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${meal.color}`}>
                                {meal.label}
                              </span>
                              <h3 className="mt-0.5 truncate text-sm font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-base">
                                {order.meal.name}
                              </h3>
                              <p className="truncate text-xs font-light text-[#5c85a0] dark:text-[#7a9baf]">
                                Menu : <span className="font-medium text-[#0d2233] dark:text-[#ddeef7]">{order.menu.name}</span>
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${sc.classes}`}>
                                {sc.icon}{sc.label}
                              </span>
                              <span className="rounded-lg border border-[#e2edf5] bg-[#f8fbfd] px-2.5 py-1 font-mono text-[0.65rem] font-medium text-[#2a7db5] dark:border-[#1a2d3e] dark:bg-[#0a1520] dark:text-[#5b9ec9]">
                                {formatTime(order.created_at)}
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </motion.section>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      {!loading && orders.length > 0 && (
        <motion.button
          onClick={() => navigate("/meal")}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#2a7db5] shadow-2xl shadow-[#2a7db5]/30 sm:hidden"
          aria-label="Nouvelle commande" style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}

export default OrderPage;