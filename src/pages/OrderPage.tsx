import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { OrderDto } from "../models/order";
import {
  Coffee,
  CheckCircle,
  Clock,
  XCircle,
  Utensils,
  Plus,
  ClipboardList,
  ChevronRight,
  Sparkles,
  Soup,
  Pizza,
  CalendarDays,
  X
} from "lucide-react";
import { DrillCalendar } from "@/components/DrillCalender";
import { isSameDay, toDate } from "date-fns";
import {
  formatDayLabel,
  formatDayShort,
  formatTime,
  isInRange,
} from "@/utils/helper";
import ErrorComponent from "@/components/error";
import type { ResponseDto } from "@/models/response";
import Navbar from "@/components/navbar/Navbar";
import type { sejourDto } from "@/models/sejour";
import { useTranslation } from "react-i18next";
import Footer from "@/components/footer/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import OrderDetails from "@/components/OrderDetails";

type Mode = "single" | "range";

function OrderPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [sejour, setSejour] = useState<sejourDto | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const [calMode, setCalMode] = useState<Mode>("single");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [calStyle, setCalStyle] = useState<React.CSSProperties>({});

  const computeCalStyle = useCallback(() => {
    if (!filterBtnRef.current) return;
    const CAL_W = 300;
    const MARGIN = 8;
    const rect = filterBtnRef.current.getBoundingClientRect();
    const viewW = window.innerWidth;
    let left = rect.right - CAL_W;
    left = Math.max(8, Math.min(left, viewW - CAL_W - 8));
    setCalStyle({
      position: "fixed",
      top: rect.bottom + MARGIN,
      left,
      width: Math.min(CAL_W, viewW - 16),
      zIndex: 9999,
    });
  }, []);

  const handleOpenCal = () => {
    if (!calOpen) computeCalStyle();
    setCalOpen((v) => !v);
  };

  useEffect(() => {
    if (!calOpen) return;
    const onResize = () => computeCalStyle();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calOpen, computeCalStyle]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    (async () => {
      try {
        if (!searchParams.has("sejour_id")) {
          setErrorMsg(
            `An error occurred while loading your orders. Please make sure you accessed the app through the correct link provided by your hospital.`,
          );
          setLoading(false);
          return;
        }
        setLoading(true);
        const apiUrl =
          import.meta.env.VITE_DEBUG === "true"
            ? `data/sejour.json`
            : `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_HISTORY}?sejour_id=${searchParams.get("sejour_id")}`;
        const reponse = await fetch(apiUrl);
        if (!reponse.ok) {
          setErrorMsg("Failed to fetch orders");
        } else {
          const sj: ResponseDto<sejourDto> = await reponse.json();
          setOrders(sj.data?.orders ?? []);
          setSejour(sj.data ?? null);
          localStorage.setItem("patient", sj.data?.name ?? "");
          localStorage.setItem("sejourId", searchParams.get("sejour_id") ?? "");
        }
      } catch (e) {
        console.error("Error loading orders:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeDates = useMemo(
    () =>
      orders
        .map((o) => toDate(o.created_at))
        .filter((d) => !isNaN(d.getTime())),
    [orders],
  );

  const hasFilter = calMode === "single" ? !!selectedDay : !!rangeStart;

  const filterLabel = useMemo(() => {
    if (calMode === "single" && selectedDay) return formatDayShort(selectedDay);
    if (calMode === "range" && rangeStart && rangeEnd)
      return `${formatDayShort(rangeStart)} → ${formatDayShort(rangeEnd)}`;
    if (calMode === "range" && rangeStart)
      return `${t("since")} ${formatDayShort(rangeStart)}`;
    return null;
  }, [calMode, selectedDay, rangeStart, rangeEnd, t]);

  const grouped = useMemo(() => {
    const today = new Date();
    let filtered: typeof orders;

    if (calMode === "single" && selectedDay) {
      filtered = orders.filter((o) =>
        isSameDay(toDate(o.created_at), selectedDay),
      );
    } else if (calMode === "range" && rangeStart && rangeEnd) {
      const from = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
      const to = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
      filtered = orders.filter((o) =>
        isInRange(toDate(o.created_at), from, to),
      );
    } else {
      filtered = orders.filter((o) => isSameDay(toDate(o.created_at), today));
    }

    const map = new Map<string, OrderDto[]>();
    filtered.forEach((o) => {
      const d = toDate(o.created_at);
      const key = isNaN(d.getTime())
        ? "unknown"
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, dayOrders]) => {
        const d =
          key === "unknown" ? new Date() : toDate(dayOrders[0].created_at);
        return { label: formatDayLabel(d), orders: dayOrders };
      });
  }, [orders, calMode, selectedDay, rangeStart, rangeEnd]);

  const clearFilter = () => {
    setSelectedDay(null);
    setRangeStart(null);
    setRangeEnd(null);
  };

  const getStatusConfig = (status: number) => {
    const configs: Record<
      number,
      { classes: string; icon: React.ReactNode; label: string }
    > = {
      0: {
        classes:
          "bg-[#fef9ec] text-[#b07d12] border-[#f5dfa0] dark:bg-[#221a03] dark:text-[#f5c842] dark:border-[#3d2f06]",
        icon: <Clock className="w-3 h-3" />,
        label: t("status_pending"),
      },
      1: {
        classes:
          "bg-[#eaf4fb] text-[#1e6fa0] border-[#b3d6ed] dark:bg-[#0a1e2d] dark:text-[#64b6e0] dark:border-[#0f2e44]",
        icon: <Utensils className="w-3 h-3" />,
        label: t("status_in_process"),
      },
      2: {
        classes:
          "bg-[#eaf7f1] text-[#1a8c5b] border-[#b3e2cf] dark:bg-[#0a2318] dark:text-[#4dd9a0] dark:border-[#0f3d28]",
        icon: <CheckCircle className="w-3 h-3" />,
        label: t("status_ready"),
      },
      3: {
        classes:
          "bg-[#fdf0f0] text-[#b03a3a] border-[#f0c0c0] dark:bg-[#2a0d0d] dark:text-[#f08080] dark:border-[#3d1515]",
        icon: <XCircle className="w-3 h-3" />,
        label: t("status_cancelled"),
      },
    };
    return (
      configs[status] ?? {
        classes:
          "bg-[#f2f8fc] text-[#5c85a0] border-[#ccdfe9] dark:bg-[#0e1e2d] dark:text-[#7a9baf] dark:border-[#1a2d3e]",
        icon: <Clock className="w-3 h-3" />,
        label: t("status_unknown"),
      }
    );
  };

  const getMealMeta = (mealName: string) => {
    const l = mealName.toLowerCase();
    if (l.includes("petit déjeuner") || l.includes("breakfast"))
      return {
        icon: <Coffee className="w-4 h-4" />,
        color:
          "bg-[#e6fff9] text-[#02c39a] dark:bg-[#00271f] dark:text-[#46fdd5]",
        bar: "from-[#bbfff8] to-[#02c39a]",
        label: t("meal_breakfast"),
      };
    if (l.includes("déjeuner") || l.includes("lunch"))
      return {
        icon: <Soup className="w-4 h-4" />,
        color:
          "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]",
        bar: "from-[#00a896] to-[#028090]",
        label: t("meal_lunch"),
      };
    if (l.includes("dîner") || l.includes("dinner"))
      return {
        icon: <Pizza className="w-4 h-4" />,
        color:
          "bg-[#e8f4fb] text-[#05668d] dark:bg-[#01151d] dark:text-[#2dbef7]",
        bar: "from-[#05668d] to-[#f0f3bd]",
        label: t("meal_dinner"),
      };
    return {
      icon: <Soup className="w-4 h-4" />,
      color:
        "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]",
      bar: "from-[#2dbef7] to-[#05668d]",
      label: t("meal_generic"),
    };
  };

  if (errorMsg) {
    return <ErrorComponent />;
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <Navbar name={sejour?.name ?? "Your Menu"} />
        <div className="content-height flex-2 bg-[#f4f9fd] px-4 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:px-5 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <motion.header
              className="mb-8"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
                  <ClipboardList size={13} className="text-[#2a7db5]" />
                  {t("your_orders")}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7] mr-auto">
                    {t("meal")}{" "}
                    <em className="italic text-[#2a7db5]">{t("history")}</em>
                  </h1>

                  {!loading && orders.length > 0 && (
                    <div className="relative flex items-center shrink-0">
                      <button
                        ref={filterBtnRef}
                        onClick={handleOpenCal}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        className={`
                          flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold
                          transition-all duration-200 max-w-45 sm:max-w-50
                          ${
                            calOpen || hasFilter
                              ? "border-[#2a7db5] bg-[#2a7db5] text-white shadow-md"
                              : "border-[#ccdfe9] bg-white text-[#5c85a0] hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] hover:text-[#2a7db5] dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#7a9baf]"
                          }
                        `}
                      >
                        <CalendarDays size={14} className="shrink-0" />
                        <span className="truncate">
                          {filterLabel ?? t("filter")}
                        </span>
                        {hasFilter && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFilter();
                              setCalOpen(false);
                            }}
                            className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/25 hover:bg-white/40"
                          >
                            <X size={10} />
                          </span>
                        )}
                      </button>

                      <AnimatePresence>
                        {calOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.16, ease: "easeOut" }}
                            style={calStyle}
                          >
                            <div className="mb-2 flex rounded-xl border border-[#ccdfe9] bg-white p-1 shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
                              {(["single", "range"] as Mode[]).map((m) => (
                                <button
                                  key={m}
                                  onClick={() => {
                                    setCalMode(m);
                                    setSelectedDay(null);
                                    setRangeStart(null);
                                    setRangeEnd(null);
                                  }}
                                  style={{
                                    WebkitTapHighlightColor: "transparent",
                                  }}
                                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-150
                                    ${calMode === m ? "bg-[#2a7db5] text-white shadow-sm" : "text-[#7a9baf] hover:text-[#5c85a0] dark:hover:text-[#ddeef7]"}`}
                                >
                                  {m === "single"
                                    ? t("cal_day")
                                    : t("cal_period")}
                                </button>
                              ))}
                            </div>
                            <DrillCalendar
                              mode={calMode}
                              selected={selectedDay}
                              rangeStart={rangeStart}
                              rangeEnd={rangeEnd}
                              onSelectSingle={setSelectedDay}
                              onSelectRange={(s, e) => {
                                setRangeStart(s);
                                setRangeEnd(e);
                              }}
                              activeDates={activeDates}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {!loading && grouped.length > 0 && (
                    <motion.button
                      onClick={() => navigate("/meal")}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="hidden sm:flex items-center gap-2 rounded-xl bg-[#2a7db5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/20 transition-colors hover:bg-[#1e6fa0] shrink-0"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <Plus size={16} strokeWidth={2.5} />
                      {t("new_order")}
                    </motion.button>
                  )}
                </div>

                <div className="h-0.5 w-12 rounded bg-[#2a7db5]" />

                {calOpen && (
                  <div
                    className="fixed inset-0 z-9998"
                    onClick={() => setCalOpen(false)}
                  />
                )}
              </div>
            </motion.header>

            {/* ── Empty state ── */}
            {!loading && orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
                  <Utensils
                    size={32}
                    className="text-[#2a7db5]"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-2xl font-bold text-[#0d2233] dark:text-[#ddeef7]">
                  {t("no_orders_yet")}
                </p>
                <p className="mt-2 max-w-xs text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
                  {t("no_orders_desc")}
                </p>
                <motion.button
                  onClick={() => navigate("/meal")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-[#2a7db5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/25 transition-colors hover:bg-[#1e6fa0]"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <Sparkles size={15} />
                  {t("browse_menu")}
                  <ChevronRight size={15} />
                </motion.button>
              </motion.div>
            ) : loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <AnimatePresence>
                  {grouped.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
                        <Utensils
                          size={32}
                          className="text-[#2a7db5]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="text-2xl font-bold text-[#0d2233] dark:text-[#ddeef7]">
                        {hasFilter
                          ? t("no_orders_filtered")
                          : t("no_orders_yet")}
                      </p>
                      <p className="mt-2 max-w-xs text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
                        {hasFilter
                          ? t("no_orders_filtered_desc")
                          : t("no_orders_desc")}
                      </p>
                      {!hasFilter && (
                        <motion.button
                          onClick={() => navigate("/meal")}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-6 flex items-center gap-2 rounded-xl bg-[#2a7db5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/25 transition-colors hover:bg-[#1e6fa0]"
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          <Sparkles size={15} />
                          {t("browse_menu")}
                          <ChevronRight size={15} />
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key={`grp-${calMode}-${selectedDay?.getTime() ?? 0}-${rangeStart?.getTime() ?? 0}-${rangeEnd?.getTime() ?? 0}`}
                  className="flex flex-col gap-6"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.07 } },
                  }}
                >
                  {grouped.map(({ label, orders: dayOrders }) => (
                    <motion.section
                      key={label}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.38,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }}
                    >
                      <div className="mb-2.5 flex items-center gap-3">
                        <span className="text-xs font-bold capitalize text-[#5c85a0] dark:text-[#7a9baf]">
                          {label}
                        </span>
                        <div className="h-px flex-1 bg-[#dde8f0] dark:bg-[#1a2d3e]" />
                        <span className="text-[0.6rem] font-semibold text-[#7a9baf]">
                          {dayOrders.length} {t("meals_count")}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {dayOrders.map((order) => {
                          const sc = getStatusConfig(order.status);
                          const meal = getMealMeta(order.meal.name);
                          const isSelected =
                            selectedOrder?.commande_id === order.commande_id;
                          return (
                            <article
                              key={order.commande_id}
                              onClick={() =>
                                setSelectedOrder(isSelected ? null : order)
                              }
                              className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0d1e2d] cursor-pointer
                                ${
                                  isSelected
                                    ? "border-[#2a7db5] shadow-[#2a7db5]/15 dark:border-[#2a7db5]"
                                    : "border-[#ccdfe9] hover:border-[#2a7db5]/40 dark:border-[#1a2d3e]"
                                }`}
                            >
                              <div
                                className={`h-0.5 w-full bg-linear-to-r ${meal.bar}`}
                              />
                              <div className="flex items-center gap-3 px-5 py-4">
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${meal.color}`}
                                >
                                  {meal.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${meal.color}`}
                                  >
                                    {meal.label}
                                  </span>
                                  <h3 className="mt-0.5 truncate text-sm font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-base">
                                    {order.meal.name}
                                  </h3>
                                  <p className="truncate text-xs font-light text-[#5c85a0] dark:text-[#7a9baf]">
                                    {t("menu_label")} :{" "}
                                    <span className="font-medium text-[#0d2233] dark:text-[#ddeef7]">
                                      {order.menu.name}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1.5">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${sc.classes}`}
                                  >
                                    {sc.icon}
                                    {sc.label}
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

          {!loading && grouped.length > 0 && (
            <motion.button
              onClick={() => navigate("/meal")}
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
              transition={{
                scale: {
                  delay: 0.4,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
                opacity: { delay: 0.4, duration: 0.3 },
                y: {
                  delay: 1,
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{ scale: 1.15, y: -8 }}
              whileTap={{ scale: 0.93, y: 0 }}
              className="fixed bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#2a7db5] shadow-2xl shadow-[#2a7db5]/30 sm:hidden"
              aria-label={t("new_order")}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-[#2a7db5]"
                animate={{ scale: [1, 1.55], opacity: [0.35, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
              />
              <Plus className="relative h-6 w-6 text-white" strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
        <Footer />
      </div>

      {selectedOrder && <OrderDetails order={selectedOrder} onClick={() => setSelectedOrder(null)}  /> }
    </>
  );
}

export default OrderPage;
