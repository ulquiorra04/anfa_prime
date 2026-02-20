import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { OrderDto } from "../models/order";
import {
  Coffee, CheckCircle, Clock, XCircle,
  Utensils, Plus, ClipboardList, ChevronRight, Sparkles,
  Soup,
  Pizza,
} from "lucide-react";

function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);


  console.log(import.meta.env.VITE_API_URL);
  console.log(import.meta.env.VITE_API_HISTORY);

const formatDate = (dateString: string) => {
  if (!dateString) return dateString;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
};
  useEffect(() => {
    const fetchSejour = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_HISTORY}`);
        const sj = await response.json();
        console.log(sj);
        if (sj) setOrders(sj.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSejour();
  }, []);

  const getStatusConfig = (status: number) => {
    switch (status) {
      case 1:
        return {
          classes: "bg-[#eaf7f1] text-[#1a8c5b] border-[#b3e2cf] dark:bg-[#0a2318] dark:text-[#4dd9a0] dark:border-[#0f3d28]",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Delivered",
        };
      case 0:
        return {
          classes: "bg-[#eaf4fb] text-[#1e6fa0] border-[#b3d6ed] dark:bg-[#0a1e2d] dark:text-[#64b6e0] dark:border-[#0f2e44]",
          icon: <Clock className="w-3 h-3" />,
          label: "On its way",
        };
      case 2:
        return {
          classes: "bg-[#fdf0f0] text-[#b03a3a] border-[#f0c0c0] dark:bg-[#2a0d0d] dark:text-[#f08080] dark:border-[#3d1515]",
          icon: <XCircle className="w-3 h-3" />,
          label: "Cancelled",
        };
      default:
        return {
          classes: "bg-[#f2f8fc] text-[#5c85a0] border-[#ccdfe9] dark:bg-[#0e1e2d] dark:text-[#7a9baf] dark:border-[#1a2d3e]",
          icon: <XCircle className="w-3 h-3" />,
          label: "Unknown",
        };
    }
  };

  const getMealMeta = (mealName: string) => {
    const lower = mealName.toLowerCase();
    if (lower.includes("petit") || lower.includes("breakfast"))
      return {
        icon: <Coffee className="w-4 h-4" />,
        color: "bg-[#e6fff9] text-[#02c39a] dark:bg-[#00271f] dark:text-[#46fdd5]",
        bar: "from-[#bbfff8] to-[#02c39a]",
        label: "Breakfast",
      };
    if (lower.includes("déj") || lower.includes("dej") || lower.includes("lunch"))
      return {
        icon: <Soup className="w-4 h-4" />,
        color: "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]",
        bar: "from-[#00a896] to-[#028090]",
        label: "Lunch",
      };
    if (lower.includes("dîner") || lower.includes("dinner") || lower.includes("dinne"))
      return {
        icon: <Pizza className="w-4 h-4" />,
        color: "bg-[#e8f4fb] text-[#05668d] dark:bg-[#01151d] dark:text-[#2dbef7]",
        bar: "from-[#05668d] to-[#f0f3bd]",
        label: "Dinner",
      };
    return {
      icon: <Soup className="w-4 h-4" />,
      color: "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]",
      bar: "from-[#2dbef7] to-[#05668d]",
      label: "Meal",
    };
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
    <div className="min-h-screen bg-[#f4f9fd] px-5 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* ── Header ── */}
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
                Your orders
              </div>
              <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7]">
                Meal{' '}
                <em className="italic text-[#2a7db5]">History</em>
              </h1>
              <div className="mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
            </div>

            {/* Desktop CTA — inline with header */}
            <motion.button
              onClick={() => navigate("/meal")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-2 self-end rounded-xl bg-[#2a7db5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/20 transition-colors duration-200 hover:bg-[#1e6fa0]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              New Order
            </motion.button>
          </div>
        </motion.header>

        {/* ── Create order banner (shown when no orders or as a top CTA) ── */}
        {!loading && orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
              <Utensils size={32} className="text-[#2a7db5]" strokeWidth={1.5} />
            </div>
            <p className=" text-2xl font-bold text-[#0d2233] dark:text-[#ddeef7]">
              No orders yet
            </p>
            <p className="mt-2 max-w-xs text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
              Browse today's menu and place your first meal order — it only takes a moment.
            </p>
            <motion.button
              onClick={() => navigate("/meal")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#2a7db5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2a7db5]/25 transition-colors duration-200 hover:bg-[#1e6fa0]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Sparkles size={15} />
              Browse today's menu
              <ChevronRight size={15} />
            </motion.button>
          </motion.div>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {/* Order list */}
            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            >
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const meal = getMealMeta(order.meal.name);

                return (
                  <motion.article
                    key={order.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    className="group overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2a7db5]/40 hover:shadow-lg dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:hover:border-[#2a7db5]/30 dark:hover:shadow-black/40"
                  >
                    <div className={`h-0.5 w-full bg-gradient-to-r ${meal.bar}`} />

                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${meal.color}`}>
                        {meal.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${meal.color}`}>
                            {meal.label}
                          </span>
                        </div>
                        <h3 className="mt-0.5 truncate text-sm font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-base">
                          {order.meal.name}
                        </h3>
                        <p className="truncate text-xs font-light text-[#5c85a0] dark:text-[#7a9baf]">
                          Menu:{' '}
                          <span className="font-medium text-[#0d2233] dark:text-[#ddeef7]">
                            {order.menu.name}
                          </span>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.classes}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                        
                        {/* Date formatée avec la nouvelle fonction */}
                        <span className="rounded bg-[#f2f8fc] px-2 py-0.5 font-mono text-[0.62rem] text-[#7a9baf] dark:bg-[#0e1e2d] dark:text-[#5c85a0]">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </>
        )}
      </div>

      <motion.button
        onClick={() => navigate("/meal")}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#2a7db5] shadow-2xl shadow-[#2a7db5]/30 sm:hidden"
        aria-label="New order"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>
    </div>
  );
}

export default OrderPage;