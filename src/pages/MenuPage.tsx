import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Utensils, 
  Salad, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  Settings2, 
  ListChecks, 
  ArrowRight,
  ChefHat
} from "lucide-react";
import { TAB_THEMES, type MenuDto } from "@/models/menu";
import type { MealsDto } from "@/models/meal";
import Navbar from "@/components/navbar/Navbar";
import type { ResponseDto } from "@/models/response";
import ErrorComponent from "@/components/error";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/BackButton";
import Footer from "@/components/footer/Footer";

// ─── Dish Detail Panel (The Sheet Style) ──────────────────────────────────────

interface DishDetailPanelProps {
  dishName: string;
  dishIndex: number;
  initialSelections?: Record<number, string>;
  onClose: () => void;
  onConfirm: (dishIndex: number, selections: Record<number, string>) => void;
  themeBar: string; // The "from-blue to-cyan" gradient string
}

function DishDetailPanel({ dishName, dishIndex, initialSelections, onClose, onConfirm, themeBar }: DishDetailPanelProps) {
  const { t } = useTranslation();
  
  // Example options logic
  const options = [
    { label: "Sauce", options: ["Sauce tomate", "Sauce béchamel", "Sauce au poivre"] },
    { label: "Accompagnement", options: ["Riz", "Pâtes", "Frites", "Légumes"] },
    { label: "Supplément", options: ["Fromage", "Oeuf", "Pain"] },
  ];
  
  const [selections, setSelections] = useState<Record<number, string>>(initialSelections || {});
  const isComplete = Object.keys(selections).length === options.length;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* Sheet panel */}
      <motion.aside
        key="sheet"
        className="fixed right-0 top-0 z-[10001] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-[#0d1e2d]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 38 }}
      >
        {/* Colored top bar */}
        <div className={`h-1 w-full bg-linear-to-r ${themeBar}`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e2edf5] px-5 py-4 dark:border-[#1a2d3e]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fb] text-[#2a7db5] dark:bg-[#0a1e2d] dark:text-[#64b6e0]">
              <Settings2 size={20} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf4fb] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#2a7db5] dark:bg-[#0a1e2d] dark:text-[#64b6e0]">
                {t("customize") ?? "Personnaliser"}
              </span>
              <h2 className="mt-0.5 text-base font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7]">
                {dishName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ccdfe9] bg-[#f4f9fd] text-[#5c85a0] transition-colors hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] hover:text-[#2a7db5] dark:border-[#1a2d3e] dark:bg-[#0a1520]"
          >
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {options.map((section, si) => (
            <div key={si} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#5c85a0] dark:text-[#7a9baf]">
                  {section.label}
                </span>
                {selections[si] && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b3e2cf] bg-[#eaf7f1] px-2.5 py-0.5 text-[0.6rem] font-bold text-[#1a8c5b] dark:border-[#0f3d28] dark:bg-[#0a2318] dark:text-[#4dd9a0]">
                    {selections[si]}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {section.options.map((opt) => {
                  const isActive = selections[si] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelections(prev => ({ ...prev, [si]: opt }))}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        isActive 
                        ? "border-[#2a7db5] bg-[#eaf4fb] text-[#2a7db5] dark:border-[#2a7db5]/40 dark:bg-[#0a1e2d] dark:text-[#64b6e0]" 
                        : "border-[#e2edf5] bg-[#f8fbfd] text-[#5c85a0] dark:border-[#1a2d3e] dark:bg-[#0a1520] dark:text-[#7a9baf]"
                      }`}
                    >
                      {opt}
                      {isActive && <CheckCircle2 size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="border-t border-[#e2edf5] p-5 dark:border-[#1a2d3e]">
          <button
            disabled={!isComplete}
            onClick={() => onConfirm(dishIndex, selections)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white transition-all ${
              isComplete ? "bg-[#2a7db5] shadow-lg shadow-[#2a7db5]/20 active:scale-[0.98]" : "bg-gray-300 dark:bg-gray-800 dark:text-gray-500"
            }`}
          >
            {t("save_selection") ?? "Enregistrer la sélection"}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

// ─── Main Menu Page Component ────────────────────────────────────────────────

const MenuPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [activeMenu, setActiveMenu] = useState<MenuDto | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [patient, setPatient] = useState<string | null>(null);
  
  // Panel States
  const [selectedDish, setSelectedDish] = useState<{ name: string; index: number } | null>(null);
  const [dishCustomizations, setDishCustomizations] = useState<Record<number, Record<number, string>>>({});

  const meal = location.state?.meal as MealsDto | undefined;

  useEffect(() => {
    const loadData = async () => {
      if (!meal) {
        setError("Meal context missing");
        setLoading(false);
        return;
      }
      try {
        const apiUrl = import.meta.env.VITE_DEBUG === 'true' 
          ? `../data/menus.json` 
          : `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MENU}?type_id=${meal.id}`;
        
        const response = await fetch(apiUrl);
        const res: ResponseDto<MenuDto[]> = await response.json();
        
        if (res.status === 1) {
          setMenus(res.data ?? []);
          setActiveMenu(res.data ? res.data[activeTab] : null);
          setPatient(localStorage.getItem('patient'));
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("Failed to load menus");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [meal, activeTab]);

  if (error) return <ErrorComponent />;

  const theme = TAB_THEMES[activeTab] ?? TAB_THEMES[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f9fd] dark:bg-[#0a1520]">
      <Navbar name={patient ?? "No Patient"} />
      
      <main className="flex-1 px-5 py-8 transition-colors duration-300 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
              <Utensils size={13} className="text-[#2a7db5]" />
              {t("todays_menu")}
            </div>
            <h1 className="text-2xl font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-3xl">
              {t("choose_your")}{" "}
              <em className="italic text-[#2a7db5]">{t("menu")}</em>
            </h1>
          </header>

          {loading ? (
            <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          ) : (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]"
            >
              <div className={`h-1 w-full bg-linear-to-r ${theme.bar}`} />
              
              <div className="p-6">
                {/* Tabs */}
                <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {menus.map((m, i) => (
                    <button 
                      key={m.id} 
                      onClick={() => { setActiveTab(i); setActiveMenu(m); setDishCustomizations({}); }}
                      className={`relative flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === i 
                        ? 'bg-[#eaf4fb] text-[#2a7db5] border border-[#ccdfe9] dark:bg-[#0a1e2d] dark:border-[#1a2d3e]' 
                        : 'text-gray-400'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                {/* Dishes List (Staggered style like OrderDetails) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#5c85a0] dark:text-[#7a9baf]">
                    <ListChecks size={14} className="text-[#2a7db5]" />
                    {t("menu_dishes") ?? "Plats du menu"}
                  </div>

                  <motion.ul 
                    className="flex flex-col gap-3"
                    initial="hidden" animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                  >
                    {activeMenu?.body.map((dish, i) => (
                      <motion.li
                        key={i}
                        variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }}
                        onClick={() => setSelectedDish({ name: dish, index: i })}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e2edf5] bg-[#f8fbfd] px-4 py-4 transition-all hover:border-[#2a7db5]/40 dark:border-[#1a2d3e] dark:bg-[#0a1520]"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf4fb] text-[0.7rem] font-bold text-[#2a7db5] dark:bg-[#0a1e2d]">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#0d2233] dark:text-[#ddeef7]">{dish}</p>
                            {dishCustomizations[i] && (
                              <p className="mt-0.5 text-[0.65rem] font-medium text-[#2a7db5] italic">
                                {Object.values(dishCustomizations[i]).join(" • ")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {!dishCustomizations[i] && <Settings2 size={14} className="text-gray-300" />}
                           <ChevronRight size={16} className="text-[#ccdfe9]" />
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <button 
                  onClick={() => navigate("/recap", { state: { meal, menu: activeMenu, customizations: dishCustomizations } })}
                  className={`mt-10 w-full py-4 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-[0.98] ${theme.btn}`}
                >
                  {t("order_menu", { name: activeMenu?.name })}
                </button>
              </div>
            </motion.article>
          )}
          <BackButton className="mx-auto mt-8" />
        </div>
      </main>

      {/* The Sheet (Side Panel) */}
      <AnimatePresence>
        {selectedDish && (
          <DishDetailPanel
            dishName={selectedDish.name}
            dishIndex={selectedDish.index}
            themeBar={theme.bar}
            initialSelections={dishCustomizations[selectedDish.index]}
            onClose={() => setSelectedDish(null)}
            onConfirm={(idx, opts) => {
              setDishCustomizations(prev => ({ ...prev, [idx]: opts }));
              setSelectedDish(null);
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MenuPage;