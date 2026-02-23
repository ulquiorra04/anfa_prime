import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Utensils,
  User,
  Calendar,
  ChefHat,
  Salad,
  Home,
  Loader2,
  Send,
} from "lucide-react";
import type { RecapState } from "@/models/recap";
import { formatTime, generateRef, formatDate } from "@/utils/helper";

const InfoRow = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-[#ccdfe9] bg-[#f4f9fd] px-4 py-3.5 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
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

const CourseTag = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) => (
  <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${color}`}>
    <Icon size={13} strokeWidth={1.8} className="shrink-0" />
    <div className="min-w-0">
      <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] opacity-70">
        {label} ·{" "}
      </span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  </div>
);

const RecapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RecapState | undefined;

  const username = state?.username ?? "Patient";
  const meal = state?.meal;
  const menu = state?.menu;

  const [ref] = useState<string>(generateRef);
  const [date] = useState<string>(formatDate);
  const [time] = useState<string>(() => formatTime(new Date().toISOString()));
  // ── Confirm order state ──
  const [confirmStatus, setConfirmStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConfirm = async () => {
    if (confirmStatus === "loading" || confirmStatus === "success") return;

    const payload = {
      reference: ref,
      username,
      meal_id: meal?.id,
      meal_name: meal?.name,
      menu_id: menu?.id,
      menu_name: menu?.name,
      menu_body: menu?.body,
      ordered_at: new Date().toISOString(),
    };

    try {
      setConfirmStatus("loading");
      setErrorMessage("");

      const response = await fetch("/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      setConfirmStatus("success");
    } catch (err) {
      setConfirmStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f9fd] px-5 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:py-14">
      <div className="mx-auto max-w-xl">
        {/* ── Success banner ── */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#b8f6fe] bg-[#e0f9f7] shadow-lg shadow-[#02c39a]/10 dark:border-[#014d57] dark:bg-[#001a1d]">
            <CheckCircle
              size={30}
              className="text-[#02c39a] dark:text-[#46fdd5]"
              strokeWidth={1.8}
            />
          </div>
          <h1 className="text-2xl font-bold text-[#0d2233] dark:text-[#ddeef7] sm:text-3xl">
            Order <em className="italic text-[#02c39a]">confirmed</em>
          </h1>
          <p className="mt-1.5 text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
            Here's a summary of your selection
          </p>
        </div>

        {/* ── Recap card ── */}
        <article className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
          {/* Top bar */}
          <div className="h-1 w-full bg-linear-to-r from-[#bbfff8] to-[#02c39a]" />

          {/* Order ref + time */}
          <div className="flex items-center justify-between px-7 pb-4 pt-6">
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7a9baf]">
                Order reference
              </p>
              <p className="font-mono text-lg font-bold text-[#0d2233] dark:text-[#ddeef7]">
                #{ref}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7a9baf]">
                Placed at
              </p>
              <p className="text-sm font-semibold text-[#0d2233] dark:text-[#ddeef7]">
                {time}
              </p>
            </div>
          </div>

          <div className="mx-7 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />

          {/* Patient details */}
          <div className="px-7 pb-2 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <User size={12} className="text-[#7a9baf]" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7a9baf]">
                Patient details
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <InfoRow icon={User} label="Patient name" value={username} />
              <InfoRow icon={Calendar} label="Order date" value={date} />
            </div>
          </div>

          <div className="mx-7 mt-5 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />

          {/* Meal selection */}
          <div className="px-7 pb-2 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Utensils size={12} className="text-[#7a9baf]" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7a9baf]">
                Meal selection
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <InfoRow icon={Utensils} label="Meal" value={meal?.name ?? "—"} />
              <InfoRow
                icon={ChefHat}
                label="Menu chosen"
                value={menu?.name ?? ""}
                accent
              />
            </div>
          </div>

          {/* Course breakdown */}
          {menu?.body && menu.body.length > 0 && (
            <>
              <div className="mx-7 mt-5 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />
              <div className="px-7 pb-6 pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <ChefHat size={12} className="text-[#7a9baf]" />
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7a9baf]">
                    Menu breakdown
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {menu.body.map((item, idx) => (
                    <CourseTag
                      key={idx}
                      icon={Salad}
                      label={`Plat ${idx + 1}`}
                      value={item}
                      color={
                        idx === 0
                          ? "bg-[#e6fff9] text-[#02c39a] dark:bg-[#00271f] dark:text-[#46fdd5]"
                          : idx === 1
                            ? "bg-[#e0f9f7] text-[#028090] dark:bg-[#001a1d] dark:text-[#29e3fc]"
                            : "bg-[#e8f4fb] text-[#05668d] dark:bg-[#01151d] dark:text-[#2dbef7]"
                      }
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </article>

        {/* ── Error message ── */}
        {confirmStatus === "error" && (
          <div className="mt-4 rounded-xl border border-[#f0c0c0] bg-[#fdf0f0] px-4 py-3 text-sm text-[#b03a3a] dark:border-[#3d1515] dark:bg-[#2a0d0d] dark:text-[#f08080]">
            {errorMessage || "Failed to place order. Please try again."}
          </div>
        )}

        
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#05668d] py-3 text-sm font-bold text-white shadow-lg shadow-[#05668d]/20 transition-all duration-200 hover:scale-[1.01] hover:bg-[#045372] active:scale-[0.99]"
          >
            <Home size={15} />
            Back to home
          </button>

          <button
            onClick={handleConfirm}
            disabled={
              confirmStatus === "loading" || confirmStatus === "success"
            }
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all duration-200
      ${
        confirmStatus === "success"
          ? "bg-[#02c39a] shadow-[#02c39a]/20 cursor-default"
          : confirmStatus === "loading"
            ? "bg-[#2a7db5]/70 shadow-[#2a7db5]/10 cursor-not-allowed"
            : "bg-[#2a7db5] shadow-[#2a7db5]/20 hover:scale-[1.01] hover:bg-[#1e6fa0] active:scale-[0.99]"
      }
    `}
          >
            {confirmStatus === "loading" ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Sending…
              </>
            ) : confirmStatus === "success" ? (
              <>
                <CheckCircle size={15} />
                Order Sent!
              </>
            ) : (
              <>
                <Send size={15} />
                Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecapPage;
