import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OrderDto } from "../models/order";
import {
  Coffee, Sun, Moon, CheckCircle, Clock, XCircle,
  Utensils, Plus, ClipboardList,
} from "lucide-react";

function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSejour = async () => {
      try {
        setLoading(true);
        const response = await fetch("data/sejour.json");
        const sj = await response.json();
        if (sj) setOrders(sj.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSejour();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          classes:
            "bg-[#eaf7f1] text-[#1a8c5b] border-[#b3e2cf] dark:bg-[#0a2318] dark:text-[#4dd9a0] dark:border-[#0f3d28]",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Delivered",
        };
      case "pending":
        return {
          classes:
            "bg-[#eaf4fb] text-[#1e6fa0] border-[#b3d6ed] dark:bg-[#0a1e2d] dark:text-[#64b6e0] dark:border-[#0f2e44]",
          icon: <Clock className="w-3 h-3" />,
          label: "On its way",
        };
      case "cancelled":
        return {
          classes:
            "bg-[#fdf0f0] text-[#b03a3a] border-[#f0c0c0] dark:bg-[#2a0d0d] dark:text-[#f08080] dark:border-[#3d1515]",
          icon: <XCircle className="w-3 h-3" />,
          label: "Cancelled",
        };
      default:
        return {
          classes:
            "bg-[#f2f8fc] text-[#5c85a0] border-[#ccdfe9] dark:bg-[#0e1e2d] dark:text-[#7a9baf] dark:border-[#1a2d3e]",
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
        color: "bg-[#fff8ee] text-[#b07a2a] dark:bg-[#1e1600] dark:text-[#d4a955]",
        bar: "from-[#f0c060] to-[#d4a042]",
      };
    if (lower.includes("déj") || lower.includes("dej") || lower.includes("lunch"))
      return {
        icon: <Sun className="w-4 h-4" />,
        color: "bg-[#edf7f2] text-[#1a8c5b] dark:bg-[#091d14] dark:text-[#4dd9a0]",
        bar: "from-[#52c48a] to-[#2a9e6a]",
      };
    if (lower.includes("dîner") || lower.includes("dinner") || lower.includes("dinne"))
      return {
        icon: <Moon className="w-4 h-4" />,
        color: "bg-[#edf1fb] text-[#3a5bb0] dark:bg-[#0d1228] dark:text-[#8faaf0]",
        bar: "from-[#7090e8] to-[#3a5bb0]",
      };
    return {
      icon: <Utensils className="w-4 h-4" />,
      color: "bg-[#f2f8fc] text-[#2a7db5] dark:bg-[#0e1e2d] dark:text-[#64b6e0]",
      bar: "from-[#64b6e0] to-[#2a7db5]",
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
    <div className="min-h-screen bg-[#f4f9fd] px-5 py-10 pb-28 transition-colors duration-300 dark:bg-[#0a1520] md:pb-10 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
            <ClipboardList size={13} className="text-[#2a7db5]" />
            Your orders
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7]">
            Meal{' '}
            <em className="italic text-[#2a7db5]">History</em>
          </h1>
          <p className="mt-2 text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
            Your recent meal orders and their current status
          </p>
          <div className="mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
        </header>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
              <Utensils size={28} className="text-[#2a7db5]" strokeWidth={1.5} />
            </div>
            <p className="[font-family:'Lora',Georgia,serif] text-xl font-bold text-[#0d2233] dark:text-[#ddeef7]">
              No orders yet
            </p>
            <p className="mt-1 text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
              Browse the menu to place your first order
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const meal = getMealMeta(order.meal.name);

              return (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2a7db5]/40 hover:shadow-lg dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:hover:border-[#2a7db5]/30 dark:hover:shadow-black/40"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* colour bar */}
                  <div className={`h-0.5 w-full bg-gradient-to-r ${meal.bar}`} />

                  <div className="flex items-center gap-3 px-5 py-4">
                    {/* meal icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${meal.color}`}>
                      {meal.icon}
                    </div>

                    {/* text */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate [font-family:'Lora',Georgia,serif] text-base font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-lg">
                        {order.meal.name}
                      </h3>
                      <p className="mt-0.5 truncate text-xs font-light text-[#5c85a0] dark:text-[#7a9baf]">
                        Menu:{' '}
                        <span className="font-medium text-[#0d2233] dark:text-[#ddeef7]">
                          {order.menu.name}
                        </span>
                      </p>
                    </div>

                    {/* right side */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusConfig.classes}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                      <span className="rounded bg-[#f2f8fc] px-2 py-0.5 font-mono text-[0.65rem] text-[#7a9baf] dark:bg-[#0e1e2d] dark:text-[#5c85a0]">
                        #{order.id}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FAB mobile ── */}
      <button
        onClick={() => navigate("/meal")}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#2a7db5] shadow-2xl shadow-[#2a7db5]/25 transition-all duration-300 hover:scale-110 hover:bg-[#1e6fa0] active:scale-95 md:hidden"
        aria-label="New order"
      >
        <Plus className="h-6 w-6 text-white" />
      </button>

      {/* ── FAB desktop ── */}
      <button
        onClick={() => navigate("/meal")}
        className="fixed bottom-6 right-6 hidden items-center gap-2 rounded-full bg-[#2a7db5] px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-[#2a7db5]/25 transition-all duration-300 hover:scale-105 hover:bg-[#1e6fa0] active:scale-95 md:flex"
      >
        <Plus className="h-4 w-4" />
        New Order
      </button>
    </div>
  );
}

export default OrderPage;
