import type { OrderDto } from "@/models/order";
import { formatTime } from "@/utils/helper";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "i18next";
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle, ChefHat, Clock, Coffee, ListChecks, Pizza, Soup, Utensils, UtensilsCrossed, XCircle } from "lucide-react";

interface OrderDetailProps {
    order: OrderDto,
    onClick: () => void
}

function OrderDetails (props: OrderDetailProps) {

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

    const sc = getStatusConfig(props.order.status);
    const meal = getMealMeta(props.order.meal.name);
    const menuBody: string[] = props.order.menu.body ?? [];




    return (
        <AnimatePresence>
            <motion.div
            key="backdrop"
            className="fixed inset-0 z-10000 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={props.onClick}
            />

            {/* Sheet panel */}
            <motion.aside
            key="sheet"
            className="fixed right-0 top-0 z-10001 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-[#0d1e2d]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            >
            {/* Colored top bar */}
            <div className={`h-1 w-full bg-linear-to-r ${meal.bar}`} />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#e2edf5] px-5 py-4 dark:border-[#1a2d3e]">
                <div className="flex items-center gap-3">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meal.color}`}
                >
                    {meal.icon}
                </div>
                <div>
                    <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${meal.color}`}
                    >
                    {meal.label}
                    </span>
                    <h2 className="mt-0.5 text-base font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7]">
                    {props.order.meal.name}
                    </h2>
                </div>
                </div>
                <button
                onClick={props.onClick}
                style={{ WebkitTapHighlightColor: "transparent" }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ccdfe9] bg-[#f4f9fd] text-[#5c85a0] transition-colors hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] hover:text-[#2a7db5] dark:border-[#1a2d3e] dark:bg-[#0a1520] dark:text-[#7a9baf]"
                >
                <ArrowRight size={15} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-[#e2edf5] bg-[#f8fbfd] px-4 py-3 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
                <span className="text-xs font-semibold text-[#5c85a0] dark:text-[#7a9baf]">
                    {t("status") ?? "Status"}
                </span>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${sc.classes}`}
                >
                    {sc.icon}
                    {sc.label}
                </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#e2edf5] bg-[#f8fbfd] p-3 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#5c85a0] dark:text-[#7a9baf]">
                    <CalendarClock size={10} />
                    {t("order_time") ?? "Time"}
                    </div>
                    <p className="font-mono text-sm font-semibold text-[#0d2233] dark:text-[#ddeef7]">
                    {formatTime(props.order.created_at)}
                    </p>
                </div>
                <div className="rounded-xl border border-[#e2edf5] bg-[#f8fbfd] p-3 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#5c85a0] dark:text-[#7a9baf]">
                    <UtensilsCrossed size={10} />
                    {t("meal_type") ?? "Meal type"}
                    </div>
                    <p className="text-sm font-semibold text-[#0d2233] dark:text-[#ddeef7]">
                    {props.order.meal.name}
                    </p>
                </div>

                <div className="rounded-xl border border-[#e2edf5] bg-[#f8fbfd] p-3 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#5c85a0] dark:text-[#7a9baf]">
                    <ChefHat size={10} />
                    {t("menu_label") ?? "Menu"}
                    </div>
                    <p className="text-sm font-semibold text-[#0d2233] dark:text-[#ddeef7]">
                    {props.order.menu.name}
                    </p>
                </div>
                </div>

                {menuBody.length > 0 && (
                <div>
                    <div className="mb-3 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#5c85a0] dark:text-[#7a9baf]">
                    <ListChecks size={12} className="text-[#2a7db5]" />
                    {t("menu_dishes") ?? "Dishes"}
                    </div>

                    <motion.ul
                    className="flex flex-col gap-2"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.06 } },
                    }}
                    >
                    {menuBody.map((dish, i) => (
                        <motion.li
                        key={i}
                        variants={{
                            hidden: { opacity: 0, x: 12 },
                            show: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            },
                        }}
                        className="flex items-center gap-3 rounded-xl border border-[#e2edf5] bg-[#f8fbfd] px-4 py-3 dark:border-[#1a2d3e] dark:bg-[#0a1520]"
                        >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eaf4fb] text-[0.6rem] font-bold text-[#2a7db5] dark:bg-[#0a1e2d] dark:text-[#64b6e0]">
                            {i + 1}
                        </span>
                        <span className="text-sm font-medium text-[#0d2233] dark:text-[#ddeef7]">
                            {dish}
                        </span>
                        </motion.li>
                    ))}
                    </motion.ul>
                </div>
                )}

                {props.order.status === 3 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/30 dark:bg-red-900/10">
                    <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-red-500 dark:text-red-400">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                        {t("order_cancelled") ?? "Order cancelled"}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300">
                        Ce repas n’est pas compatible avec votre régime alimentaire. La nutritionniste viendra vous expliquer.
                        </p>
                    </div>
                    </div>
                </div>
                )}
            </div>
            </motion.aside>
        </AnimatePresence>
    );
}

export default OrderDetails;