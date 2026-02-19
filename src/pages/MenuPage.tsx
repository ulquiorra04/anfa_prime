import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Utensils, ChefHat, Salad, UtensilsCrossed, Cake, CheckCircle } from "lucide-react";
import { TAB_THEMES, type MenuDto } from "@/models/menu";
import type { MealDto } from "@/models/meal";

const MenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState<string>("Patient");

  const meal = location.state?.meal as MealDto | undefined;
  const menusFromState = location.state?.menus as MenuDto[] | undefined;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        //const sejourRes = await fetch("/data/sejour.json");
        const sejourRes = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MENU}`);
        const sejour = await sejourRes.json();
        if (sejour?.name) setUsername(sejour.name);
        if (menusFromState && menusFromState.length > 0) {
          setMenus(menusFromState);
          return;
        }
        const menusRes = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MENU}`);
        const data: MenuDto[] = await menusRes.json();
        setMenus(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [menusFromState]);

  const theme = TAB_THEMES[activeTab] ?? TAB_THEMES[0];
  const activeMenu = menus[activeTab];

  const handleOrder = () => navigate("/recap", { state: { username, meal, menu: activeMenu } });

  return (
    <div className="min-h-screen bg-[#f4f9fd] px-5 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:py-14">
      <div className="mx-auto max-w-7xl">

        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ccdfe9] bg-white px-4 py-2 text-sm font-medium text-[#5c85a0] transition-all duration-200 hover:-translate-x-0.5 hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#7a9baf] dark:hover:bg-[#0d1a26]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft size={15} />
          Back to meals
        </motion.button>
  <motion.header
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
            <Utensils size={13} className="text-[#2a7db5]" />
            Today's Menu
          </div>
          <h1 className="text-2xl font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-3xl">
                    Choose your <em className="italic text-[#2a7db5]">menu</em>
                  </h1>
          
          <div className="mx-auto mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
        </motion.header>


        {loading ? (
          <LoadingSkeleton />
        ) : menus.length === 0 ? (
          <NotFound onBack={() => navigate(-1)} />
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm dark:border-[#1a2d3e] dark:bg-[#0d1e2d]"
          >
            <motion.div
              className={`h-1 w-full bg-gradient-to-r transition-all duration-500 ${theme.bar}`}
              layoutId="tab-bar"
            />


            <div className="mx-7 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />

            <div className="px-7 pb-7 pt-5">

              {/* ── Improved Tab bar ── */}
              <div className="mb-6">
                {/* Tab pills row */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {menus.map((menu, idx) => {
                    const isActive = idx === activeTab;
                    const tabTheme = TAB_THEMES[idx] ?? TAB_THEMES[0];
                    return (
                      <button
                        key={menu.id}
                        onClick={() => setActiveTab(idx)}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        className={`
                          relative flex-1 min-w-[80px] min-h-[52px] rounded-xl px-3 py-2.5
                          text-sm font-semibold transition-all duration-200
                          outline-none focus-visible:ring-2 focus-visible:ring-[#2a7db5] focus-visible:ring-offset-2
                          dark:focus-visible:ring-offset-[#0a1520]
                          active:scale-[0.97]
                          ${isActive
                            ? `${tabTheme.activeBg} ${tabTheme.active} shadow-md border border-[#ccdfe9] dark:border-[#1a2d3e]`
                            : 'bg-[#f4f9fd] text-[#7a9baf] border border-transparent hover:bg-[#eaf4fb] hover:text-[#5c85a0] dark:bg-[#0a1520] dark:text-[#5c85a0] dark:hover:bg-[#0d1a26]'
                          }
                        `}
                      >
                        {/* Active indicator dot */}
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

              {/* Section label */}
              <div className="mb-3 flex items-center gap-2">
                <ChefHat size={13} className="text-[#7a9baf]" />
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7a9baf]">
                  Today's selection
                </p>
              </div>

              {/* Course rows */}
              <AnimatePresence mode="wait">
                {activeMenu && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex flex-col gap-2.5"
                  >
                    {
                      activeMenu.body.map(
                        (el, idx) => {
                          return (
                            <>
                              <CourseRow icon={Salad} label={`Plat ${idx+1}`} value={el}  bar={theme.entree}  />
                            </>
                          );
                        }
                      )
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Order button */}
              <motion.button
                onClick={handleOrder}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-colors duration-200 ${theme.btn}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <CheckCircle size={16} strokeWidth={2.2} />
                Order {activeMenu?.name}
              </motion.button>
            </div>
          </motion.article>
        )}
      </div>
    </div>
  );
};

const CourseRow = ({
  icon: Icon, label, value, bar,
}: {
  icon: React.ElementType; label: string; value: string; bar: string;
}) => (
  <div className="flex items-start gap-4 rounded-xl border border-[#ccdfe9] bg-[#f4f9fd] px-4 py-3.5 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bar}`}>
      <Icon size={15} strokeWidth={1.8} />
    </div>
    <div className="min-w-0">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#7a9baf] dark:text-[#5c85a0]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[#0d2233] dark:text-[#ddeef7]">{value}</p>
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
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[52px] flex-1 rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
        ))}
      </div>
      <div className="h-10 w-full rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 w-full rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
      ))}
      <div className="h-12 w-full rounded-xl bg-[#dde8f0] dark:bg-[#1a2d3e]" />
    </div>
  </div>
);

const NotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ccdfe9] bg-white dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
      <Utensils size={28} className="text-[#7a9baf]" strokeWidth={1.5} />
    </div>
    <p className=" text-xl font-bold text-[#0d2233] dark:text-[#ddeef7]">
      No menus available
    </p>
    <p className="mt-1 text-sm font-light text-[#5c85a0] dark:text-[#7a9baf]">
      Check back later or contact the kitchen
    </p>
    <button onClick={onBack} className="mt-6 rounded-full border border-[#ccdfe9] bg-[#f4f9fd] px-5 py-2 text-sm font-semibold text-[#5c85a0] transition-all hover:border-[#2a7db5]/40 dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#7a9baf]">
      ← Back to meals
    </button>
  </div>
);

export default MenuPage;