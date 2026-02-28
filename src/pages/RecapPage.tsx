import { useEffect, useState } from "react";
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
  Check,
  Clock,
} from "lucide-react";
import type { RecapState } from "@/models/recap";
import { generateRef, formatDate, formatTime } from "@/utils/helper";
import Navbar from "@/components/navbar/Navbar";
import { useTranslation } from "react-i18next";
import CourseTag from "@/components/CourseTag";
import InfoRow from "@/components/InfoRow";
import SectionHeader from "@/components/SectionHeader";
import Footer from "@/components/footer/Footer";
import ErrorComponent from "@/components/error";

const RecapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RecapState | undefined;
  const [patient, setPatient] = useState<string|null>(null);
  const { t } = useTranslation();

  const meal = state?.meal;
  const menu = state?.menu;

  const [ref] = useState<string>(generateRef);
  const [date] = useState<string>(formatDate);
  const [time] = useState<string>(() => formatTime(new Date().toISOString()));

  const [confirmStatus, setConfirmStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConfirm = async () => {
    if (confirmStatus === "loading" || confirmStatus === "success") return;

    const payload = {
      sejour_id: localStorage.getItem('sejourId'),
      menu_id: menu?.id
    };

    try {
      setConfirmStatus("loading");
      setErrorMessage("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_POST_ORDER}`, {
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

  useEffect(() => {
    const checkPrerequested = () => {
      if(!localStorage.getItem('sejourId') || !localStorage.getItem('patient')) {
        setErrorMessage(`No sejour ID found. Please access the app through the correct link provided by your hospital.`);
        return;
      }

      setPatient(localStorage.getItem("patient"));
    }

    checkPrerequested();
  }, []);

  if(errorMessage) {
    return (
      <>
        <ErrorComponent msg={errorMessage} />;
      </>
    );
  }


  return (
    <>
      <div className="flex flex-col h-full">
        <Navbar name={patient ?? ""} />
        <div className="content-height bg-[#f4f9fd] px-5 py-5 transition-colors duration-300 dark:bg-[#0a1520] sm:py-14">
          <div className="mx-auto max-w-xl">
            {/* ── Success banner ── */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-2xl bg-[#02c39a]/20 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#b8f6fe] bg-[#e0f9f7] shadow-lg shadow-[#02c39a]/10 dark:border-[#014d57] dark:bg-[#001a1d]">
                  <CheckCircle
                    size={30}
                    className="text-[#02c39a] dark:text-[#46fdd5]"
                    strokeWidth={1.8}
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#0d2233] dark:text-[#ddeef7] sm:text-3xl">
                {t("order")}{" "}
                <em className="italic text-[#02c39a]">{t("confirme")}</em>
              </h1>
              <p className="mt-1.5 text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
                {t("order_summary")}
              </p>
            </div>
            <article className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
              <div className="h-1 w-full bg-linear-to-r from-[#bbfff8] via-[#02c39a] to-[#2a7db5]" />

              <div className="px-7 pb-2 pt-6">
                <SectionHeader icon={User} label={t("order_details")} />
                <div className="flex flex-col gap-2">
                  <InfoRow icon={Calendar} label={t("order_date")} value={date} />
                  <InfoRow icon={Clock} label={t("order_time")} value={time} />
                </div>
              </div>

              <div className="my-5">
                <div className="mx-7 h-px bg-linear-to-r from-transparent via-[#dde8f0] to-transparent dark:via-[#1a2d3e]" />
              </div>

              <div className="px-7 pb-2">
                <SectionHeader icon={Utensils} label={t("meal_selection")} />
                <div className="flex flex-col gap-2">
                  <InfoRow
                    icon={Utensils}
                    label={t("meal")}
                    value={meal?.name ?? "—"}
                  />
                  <InfoRow
                    icon={ChefHat}
                    label={t("menu_chosen")}
                    value={menu?.name ?? "—"}
                    accent
                  />
                </div>
              </div>

              {menu?.body && menu.body.length > 0 && (
                <>
                  <div className="my-5">
                    <div className="mx-7 h-px bg-linear-to-r from-transparent via-[#dde8f0] to-transparent dark:via-[#1a2d3e]" />
                  </div>
                  <div className="px-7 pb-7">
                    <SectionHeader icon={ChefHat} label={t("menu_breakdown")} />
                    <div className="flex flex-col gap-2">
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
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#f0c0c0] bg-[#fdf0f0] px-4 py-3 dark:border-[#3d1515] dark:bg-[#2a0d0d]">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#b03a3a]" />
                <p className="text-sm text-[#b03a3a] dark:text-[#f08080]">
                  {errorMessage || "Failed to place order. Please try again."}
                </p>
              </div>
            )}

            {/* ── Action buttons ── */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/?sejour_id=${localStorage.getItem('sejourId')}`)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#ccdfe9] bg-white py-3.5 text-sm font-bold text-[#05668d] shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-[#05668d]/30 hover:bg-[#f0f9fd] active:scale-[0.99] dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#29e3fc] dark:hover:bg-[#0a1a2a]"
              >
                <Home size={15} />
                <span className="hidden sm:inline">{t("back_to_home")}</span>
              </button>

              <button
                onClick={handleConfirm}
                disabled={
                  confirmStatus === "loading" || confirmStatus === "success"
                }
                className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200
                  ${
                    confirmStatus === "success"
                      ? "bg-[#02c39a] shadow-[#02c39a]/20 cursor-default"
                      : confirmStatus === "loading"
                        ? "bg-[#2a7db5]/60 shadow-none cursor-not-allowed"
                        : "bg-[#2a7db5] shadow-[#2a7db5]/20 hover:scale-[1.01] hover:bg-[#1e6fa0] active:scale-[0.99]"
                  }`}
              >
                {confirmStatus === "loading" ? (
                  <>
                    <Loader2 size={15} className="animate-spin " />
                    <span>{t("sending")}</span>
                  </>
                ) : confirmStatus === "success" ? (
                  <>
                    <CheckCircle size={15} />
                    <span className="hidden sm:inline">{t("order_sent")}</span>
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    <span className="hidden sm:inline">{t("confirm_order")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RecapPage;
