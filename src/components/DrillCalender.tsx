import { DAY_HEADERS, isInRange, MONTH_NAMES, MONTH_SHORT } from "@/utils/helper";
import { isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Mode = "single" | "range";
type Step = "year" | "month" | "day";

export function DrillCalendar({
  mode,
  selected,
  rangeStart,
  rangeEnd,
  onSelectSingle,
  onSelectRange,
  activeDates,
}: {
  readonly mode: Mode;
  readonly selected: Date | null;
  readonly rangeStart: Date | null;
  readonly rangeEnd: Date | null;
  readonly onSelectSingle: (d: Date | null) => void;
  readonly onSelectRange: (s: Date | null, e: Date | null) => void;
  readonly activeDates: Date[];
}) {
  const today = new Date();
  const [step, setStep] = useState<Step>("year");
  const [pickedYear, setPickedYear] = useState(today.getFullYear());
  const [pickedMonth, setPickedMonth] = useState(today.getMonth());
  const [yearPage, setYearPage] = useState(0);
  const [hovered, setHovered] = useState<Date | null>(null);

  const YEARS_PER_PAGE = 12;
  const baseYear = today.getFullYear() - 5 + yearPage * YEARS_PER_PAGE;
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => baseYear + i);

  const hasOrderInYear = (y: number) => activeDates.some((d) => d.getFullYear() === y);
  const hasOrderInMonth = (y: number, m: number) =>
    activeDates.some((d) => d.getFullYear() === y && d.getMonth() === m);
  const hasOrderOnDay = (d: Date) => activeDates.some((ad) => isSameDay(ad, d));

  const firstDay = new Date(pickedYear, pickedMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(pickedYear, pickedMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...new Array(startOffset).fill(null),
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
        if (isSameDay(d, rangeStart)) {
          onSelectRange(null, null);
          return;
        }
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
      ? (rangeStart <= effectiveEnd ? rangeStart : effectiveEnd)
      : rangeStart;
    const to = rangeStart && effectiveEnd
      ? (rangeStart <= effectiveEnd ? effectiveEnd : rangeStart)
      : null;

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

  const clearAll = () => {
    onSelectSingle(null);
    onSelectRange(null, null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-xl dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
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
          onClick={() => {
            if (step !== "year") setStep(step === "day" ? "month" : "year");
          }}
          className={`flex-1 text-center text-xs font-bold text-[#0d2233] transition-colors dark:text-[#ddeef7]
            ${step !== "year" ? "cursor-pointer hover:text-[#2a7db5]" : "cursor-default"}`}
        >
          {stepLabel}
        </button>

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

        {step === "day" && (
          <div className="flex gap-1">
            <button
              onClick={() => {
                if (pickedMonth === 0) {
                  setPickedMonth(11);
                  setPickedYear((y) => y - 1);
                } else {
                  setPickedMonth((m) => m - 1);
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => {
                if (pickedMonth === 11) {
                  setPickedMonth(0);
                  setPickedYear((y) => y + 1);
                } else {
                  setPickedMonth((m) => m + 1);
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5c85a0] hover:bg-[#f0f8ff] hover:text-[#2a7db5] dark:hover:bg-[#0f2235]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="p-2">
        <AnimatePresence mode="wait">
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
                    onClick={() => {
                      setPickedYear(y);
                      setStep("month");
                    }}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={`
                      relative flex min-h-11 flex-col items-center justify-center rounded-xl py-2.5 text-xs font-semibold
                      transition-all duration-150
                      ${
                        isPicked
                          ? "bg-[#2a7db5] text-white shadow-md"
                          : isCurrent
                            ? "border border-[#2a7db5]/40 text-[#2a7db5] dark:text-[#5b9ec9]"
                            : "text-[#0d2233] hover:bg-[#f0f8ff] dark:text-[#ddeef7] dark:hover:bg-[#0f2235]"
                      }
                    `}
                  >
                    {y}
                    {active && (
                      <span
                        className={`mt-0.5 h-1 w-1 rounded-full ${
                          isPicked ? "bg-white/70" : "bg-[#2a7db5] dark:bg-[#5b9ec9]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

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
                    onClick={() => {
                      setPickedMonth(m);
                      setStep("day");
                    }}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={`
                      relative flex min-h-11 flex-col items-center justify-center rounded-xl py-3 text-xs font-semibold
                      transition-all duration-150
                      ${
                        isPicked
                          ? "bg-[#2a7db5] text-white shadow-md"
                          : isCurrent
                            ? "border border-[#2a7db5]/40 text-[#2a7db5] dark:text-[#5b9ec9]"
                            : active
                              ? "text-[#0d2233] hover:bg-[#f0f8ff] dark:text-[#ddeef7] dark:hover:bg-[#0f2235]"
                              : "text-[#aabdcb] hover:bg-[#f0f8ff] dark:text-[#3a4d5e] dark:hover:bg-[#0f2235]"
                      }
                    `}
                  >
                    {name}
                    {active && (
                      <span
                        className={`mt-0.5 h-1 w-1 rounded-full ${
                          isPicked ? "bg-white/70" : "bg-[#2a7db5] dark:bg-[#5b9ec9]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {step === "day" && (
            <motion.div
              key="day"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              <div className="mb-1 grid grid-cols-7">
                {DAY_HEADERS.map((d) => (
                  <div
                    key={d}
                    className="py-1 text-center text-[0.55rem] font-bold uppercase tracking-widest text-[#7a9baf]"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} className="min-h-8" />;
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
                        relative flex min-h-8 flex-col items-center justify-center
                        text-[0.7rem] font-semibold transition-all duration-100
                        ${s === "selected" ? "z-10 rounded-lg bg-[#2a7db5] text-white shadow-md" : ""}
                        ${s === "range-end-hover" ? "rounded-lg bg-[#2a7db5]/60 text-white" : ""}
                        ${
                          s === "in-range"
                            ? "bg-[#2a7db5]/12 text-[#2a7db5] dark:bg-[#2a7db5]/20 dark:text-[#5b9ec9]"
                            : ""
                        }
                        ${
                          s === "today"
                            ? "rounded-lg border border-[#2a7db5]/50 text-[#2a7db5] dark:text-[#5b9ec9]"
                            : ""
                        }
                        ${
                          s === "normal"
                            ? "rounded-lg text-[#0d2233] hover:bg-[#f0f8ff] dark:text-[#ddeef7] dark:hover:bg-[#0f2235]"
                            : ""
                        }
                      `}
                    >
                      {d.getDate()}
                      {active && (
                        <span
                          className={`absolute bottom-0.5 h-0.75 w-0.75 rounded-full ${
                            s === "selected" ? "bg-white/70" : "bg-[#2a7db5] dark:bg-[#5b9ec9]"
                          }`}
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