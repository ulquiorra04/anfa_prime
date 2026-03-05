import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, ChefHat, Salad, CheckCircle } from "lucide-react";
import { TAB_THEMES, type MenuDto } from "@/models/menu";
import type { MealsDto } from "@/models/meal";
import Navbar from "@/components/navbar/Navbar";
import type { ResponseDto } from "@/models/response";
import ErrorComponent from "@/components/error";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/BackButton";
import Footer from "@/components/footer/Footer";

const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<string | null>(null);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [activeMenu, setActiveMenu] = useState<MenuDto | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  

  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const meal = location.state?.meal as MealsDto | undefined;
  const menusFromState = location.state?.menus as MenuDto[] | undefined;

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const load = async () => {
      try {

        if(meal === undefined) {
          setError("No meal information found. Please access the menu through the correct flow starting from the meals page.");
          setLoading(false);
          return;
        }

        const apiUrl = (import.meta.env.VITE_DEBUG === 'true') ? `../data/menus.json` : `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MENU}?type_id=${meal.id}`;
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          setError(
            `Failed to fetch menus: ${response.status} ${response.statusText}`,
          );
        } else {
          const mns: ResponseDto<MenuDto[]> = await response.json();
          if (mns.status === 0 || mns.status === -1) {
            setError(mns.message);
          } else {
            setMenus(mns.data ?? []);
            setActiveMenu(mns.data ? mns.data[activeTab] : null);
            setPatient(localStorage.getItem(`patient`));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load menus`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [menusFromState, meal, activeTab]);

  const theme = TAB_THEMES[activeTab] ?? TAB_THEMES[0];
  //const activeMenu = menus[activeTab];

  const handleOrder = () => {
    navigate("/recap", {
      state: {
        meal: meal ? { id: meal.id, name: meal.name } : undefined,
        menu: activeMenu,
      },
    });
  };

  if (error) {
    return (
      <>
        <ErrorComponent />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <Navbar name={patient ?? "No Patient"} />
        <div className="content-height bg-[#f4f9fd] px-5 py-5 transition-colors duration-300 dark:bg-[#0a1520] sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.header
              className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
                <Utensils size={13} className="text-[#2a7db5]" />
                {t("todays_menu")}
              </div>
              <h1 className="text-2xl font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-3xl">
                {t("choose_your")}{" "}
                <em className="italic text-[#2a7db5]">{t("menu")}</em>
              </h1>
              <div className="mx-auto mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
            </motion.header>

            {loading ? (
              <LoadingSkeleton />
            ) : menus.length === 0 ? (
              <NotFound onBack={() => navigate(-1)} t={t} />
            ) : (
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]"
              >
                <motion.div
                  className={`h-1 w-full bg-linear-to-r transition-all duration-500 ${theme.bar}`}
                  layoutId="tab-bar"
                />

                <div className="mx-7 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />

                <div className="px-7 pb-7 pt-5">
                  <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {menus.map((menu, idx) => {
                        const isActive = idx === activeTab;
                        const tabTheme = TAB_THEMES[idx] ?? TAB_THEMES[0];
                        return (
                          <button
                            key={menu.menu_id}
                            onClick={() => {
                              setActiveTab(idx);
                              setActiveMenu(menu);
                            }}
                            style={{ WebkitTapHighlightColor: "transparent" }}
                            className={`
                              relative flex-1 min-w-20 min-h-13 rounded-xl px-3 py-2.5
                              text-sm font-semibold transition-all duration-200
                              outline-none focus-visible:ring-2 focus-visible:ring-[#2a7db5] focus-visible:ring-offset-2
                              dark:focus-visible:ring-offset-[#0a1520]
                              active:scale-[0.97]
                              ${
                                isActive
                                  ? `${tabTheme.activeBg} ${tabTheme.active} shadow-md border border-[#ccdfe9] dark:border-[#1a2d3e]`
                                  : "bg-[#f4f9fd] text-[#7a9baf] border border-transparent hover:bg-[#eaf4fb] hover:text-[#5c85a0] dark:bg-[#0a1520] dark:text-[#5c85a0] dark:hover:bg-[#0d1a26]"
                              }
                            `}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="tab-dot"
                                className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full ${tabTheme.activeIndicator}`}
                              />
                            )}
                            <span className="relative">{menu.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <ChefHat size={13} className="text-[#7a9baf]" />
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7a9baf]">
                      {t("todays_selection")}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeMenu && (
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex flex-col gap-2.5"
                      >
                        {activeMenu.body.map((el, idx) => {
                          return (
                            <>
                              <CourseRow
                                    key={`${activeMenu.menu_id}-${idx}`} // Add a key here
                                icon={Salad}
                                label={`${t("dish")} ${idx + 1}`}
                                value={el}
                                bar={theme.entree}
                              />
                            </>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleOrder}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-colors duration-200 ${theme.btn}`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <CheckCircle size={16} strokeWidth={2.2} />
                    {t("order_menu", { name: activeMenu?.name })}
                  </motion.button>
                </div>
              </motion.article>
            )}

            <BackButton className="mx-auto mt-8" />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

const CourseRow = ({
  icon: Icon,
  label,
  value,
  bar,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  bar: string;
}) => (
  <div className="flex items-start gap-4 rounded-xl border border-[#ccdfe9] bg-[#f4f9fd] px-4 py-3.5 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
    <div
      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bar}`}
    >
      <Icon size={15} strokeWidth={1.8} />
    </div>
    <div className="min-w-0">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#7a9baf] dark:text-[#5c85a0]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[#0d2233] dark:text-[#ddeef7]">
        {value}
      </p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
    <div className="h-1 w-full bg-[#ccdfe9] dark:bg-[#1a2d3e]" />
    <div className="space-y-4 px-7 pb-5 pt-7">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-[#dde8f0] dark:bg-[#1a2d3e]" />
          <div className="h-6 w-52 rounded bg-[#dde8f0] dark:bg-[#1a2d3e]" />
        </div>
      </div>
    </div>
    <div className="mx-7 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />
    <div className="space-y-3 px-7 pb-7 pt-5">
      <div className="flex gap-2">
        {[... new Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-13 flex-1 rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]"
          />
        ))}
      </div>
      <div className="h-10 w-full rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
      {[... new Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-14 w-full rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]"
        />
      ))}
      <div className="h-12 w-full rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
    </div>
  </div>
);

const NotFound = ({  t,
}: {
  onBack: () => void;
  t: (key: string) => string;
}) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
      <Utensils size={28} className="text-[#7a9baf]" strokeWidth={1.5} />
    </div>
    <p className="text-xl font-bold text-[#0d2233] dark:text-[#ddeef7]">
      {t("no_menus_available")}
    </p>
    <p className="mt-1 text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
      {t("no_menus_desc")}
    </p>
  </div>
);

export default MenuPage;
