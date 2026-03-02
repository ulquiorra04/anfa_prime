import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Utensils, ChevronRight } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { CARD_ACCENTS, type MealsDto } from "@/models/meal";
import { cardVariants, containerVariants } from "@/utils/motion";
import ErrorComponent from "@/components/error";
import Navbar from "@/components/navbar/Navbar";
import type { ResponseDto } from "@/models/response";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/BackButton";
import Footer from "@/components/footer/Footer";

const MealsPage = () => {
  const { t, i18n } = useTranslation();
  const [meals, setMeals] = useState<MealsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<string | null>(null);
  

  const [pressedId, setPressedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);

  if (!themeContext)
    throw new Error("MealsPage must be used within a ThemeProvider");

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const fetchmeals = async () => {
      try {
        // Get Sejour ID from localStorage (set in OrderPage) and use it to fetch meals
        if (!localStorage.getItem("sejourId")) {
          setError("No sejour ID found. Please access the app through the correct link provided by your hospital.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const apiUrl = (import.meta.env.VITE_DEBUG === 'true') ? `data/meals.json` : `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MEALS}?sejour_id=${localStorage.getItem("sejourId")}`;
        const response = await fetch(apiUrl);
        if (!response.ok){
          setError(`Failed to fetch meals: ${response.status} ${response.statusText}`);
        } else {
          const mls: ResponseDto<MealsDto[]> = await response.json();
          if (mls.status === 0 || mls.status === -1) {
            setError(mls.message);
          } else {
            setMeals(mls.data ?? []);
            setPatient(localStorage.getItem("patient"));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load meals");
      } finally {
        setLoading(false);
      }
    };
    fetchmeals();
  }, []);

  const handleMealsClick = (meal: MealsDto) => {
    navigate(`/meal/${meal.id}`, { state: { meal } });
  };

  const handleKeyDown = (e: React.KeyboardEvent, meal: MealsDto) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMealsClick(meal);
    }
  };
  if (error) {
    return (
      <>
        <Navbar name={patient ?? "NO Patient"} />
        <ErrorComponent msg={error} />
      </>
    );
  }
  const colsClass =
    meals.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : meals.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : meals.length === 4
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className="flex flex-col h-full">
        <Navbar name={patient ?? "NO Patient"} />
          <div className="content-height flex-2 bg-[#f4f9fd] px-4 py-5 transition-colors duration-300 dark:bg-[#0a1520] sm:px-5 sm:py-14">
            <div className="mx-auto max-w-7xl">
              <motion.header
                className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
                  <Utensils size={13} className="text-[#2a7db5]" />
                  {t("todays_menu")}
                </div>
                <h1 className="mb-3 text-[clamp(2.2rem,6vw,3.8rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7]">
                  {t("choose_your")}{" "}
                  <em className="italic text-[#2a7db5]">{t("meal")}</em>
                </h1>
                <div className="mx-auto mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
              </motion.header>

              {loading ? (
                <div className={`grid gap-5 ${colsClass} lg:gap-7`}>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-48 w-full rounded-2xl bg-[#e6f0f8] dark:bg-[#0e1e2d]"
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  className={`grid gap-5 ${colsClass} lg:gap-7`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {meals.map((cat, idx) => {
                    const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];

                    return (
                      <motion.article
                        key={cat.id}
                        variants={cardVariants}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2a7db5]/40 hover:shadow-xl dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:hover:border-[#2a7db5]/30 dark:hover:shadow-black/40"
                      >
                        <div
                          className={`h-1 w-full bg-linear-to-r ${accent.bar}`}
                        />
                        <div className="flex items-center gap-3 px-5 pb-4 pt-5">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent.iconBg} ${accent.iconBorder} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                          >
                            <Utensils
                              size={20}
                              className={accent.iconColor}
                              strokeWidth={1.8}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#7a9baf]">
                              #{cat.id}
                            </p>
                            <h2 className="text-xl font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7]">
                              {cat.name}
                            </h2>
                          </div>
                        </div>

                        <div className="mx-5 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />

                        <div className="flex flex-1 flex-col px-4 pb-5 pt-3 sm:px-5">
                          <motion.button
                            key={cat.id}
                            type="button"
                            aria-label={`${t("select")} ${cat.name}`}
                            onClick={() => handleMealsClick(cat)}
                            onTouchStart={() => setPressedId(String(cat.id))}
                            onTouchEnd={() => setPressedId(null)}
                            onMouseDown={() => setPressedId(String(cat.id))}
                            onMouseUp={() => setPressedId(null)}
                            onMouseLeave={() => setPressedId(null)}
                            onKeyDown={(e) => handleKeyDown(e, cat)}
                            whileTap={{ scale: 0.97 }}
                            className={`
                              group/item relative flex w-full cursor-pointer items-center justify-between
                              overflow-hidden rounded-xl border px-4 text-left
                              outline-none transition-colors duration-150
                              min-h-13 py-3
                              border-[#e2edf5] bg-[#f8fbfd]
                              text-sm font-medium text-[#0d2233]
                              dark:border-[#1a2d3e] dark:bg-[#0d1a26] dark:text-[#ddeef7]
                              hover:border-[#2a7db5]/50 hover:bg-[#eef6fc]
                              dark:hover:border-[#2a7db5]/40 dark:hover:bg-[#0f2235]
                              focus-visible:ring-2 focus-visible:ring-[#2a7db5] focus-visible:ring-offset-2
                              dark:focus-visible:ring-offset-[#0a1520]
                              ${pressedId === String(cat.id) ? "bg-[#e4f1f9] border-[#2a7db5]/60 dark:bg-[#0c1e30]" : ""}
                            `}
                            style={{ WebkitTapHighlightColor: "transparent" }}
                          >
                            <span
                              className={`
                                absolute left-0 top-0 h-full w-0.75 rounded-r-full
                                bg-[#2a7db5] transition-transform duration-150 origin-left
                                ${pressedId === String(cat.id) ? "scale-x-100" : "scale-x-0"}
                                group-hover/item:scale-x-100
                              `}
                            />
                            <span className="truncate pl-1 pr-3">
                              {t("view_meals", { name: cat.name })}
                            </span>
                            <ChevronRight
                              size={18}
                              className="
                                shrink-0 text-[#2a7db5]
                                transition-all duration-200 opacity-60
                                md:opacity-0 md:-translate-x-1
                                group-hover/item:opacity-100 group-hover/item:translate-x-0
                              "
                            />
                          </motion.button>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
              <BackButton className="mx-auto mt-8" />
            </div>
          </div>
        <Footer />
      </div>
    </>
  );
};

export default MealsPage;
