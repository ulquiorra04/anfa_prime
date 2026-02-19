import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Utensils, ChevronRight, ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { CATEGORIES, type MealDto } from '@/models/meal';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.06, ease: 'easeOut' },
  }),
};

const MealsPage = () => {
  const [meals, setMeals] = useState<MealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pressedId, setPressedId] = useState<number | null>(null);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) throw new Error('MealsPage must be used within a ThemeProvider');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        //const response = await fetch('data/meals.json');
        const response = await fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MEALS}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data);
        setMeals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const mealsPerCard = Math.ceil(meals.length / 3);
  const mealGroups = [
    meals.slice(0, mealsPerCard),
    meals.slice(mealsPerCard, mealsPerCard * 2),
    meals.slice(mealsPerCard * 2),
  ];

  const handleMealClick = (id: number) => navigate(`/meal/${id}`);
  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMealClick(id);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f9fd] p-4 dark:bg-[#0a1520]">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f9fd] px-4 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:px-5 sm:py-14">
      <div className="mx-auto max-w-7xl">

        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={() => navigate('/order')}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ccdfe9] bg-white px-4 py-2 text-sm font-medium text-[#5c85a0] transition-all duration-200 hover:-translate-x-0.5 hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] active:scale-95 dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#7a9baf] dark:hover:bg-[#0d1a26]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft size={15} />
          Back to orders
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
          <h1 className="mb-3 text-[clamp(2.2rem,6vw,3.8rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7]">
            Choose your{' '}
            <em className="italic text-[#2a7db5]">meal</em>
          </h1>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
        </motion.header>

        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {CATEGORIES.map((cat, idx) => {
            const group = mealGroups[idx] ?? [];
            const count = group.length;

            return (
              <motion.article
                key={idx}
                variants={cardVariants}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2a7db5]/40 hover:shadow-xl dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:hover:border-[#2a7db5]/30 dark:hover:shadow-black/40"
              >
                <div className={`h-1 w-full bg-gradient-to-r ${cat.bar}`} />

                <div className="flex items-start gap-3 px-5 pb-3 pt-5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${cat.iconBg} ${cat.iconBorder} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                    <cat.Icon size={20} className={cat.iconColor} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#7a9baf]">
                      {cat.tag}
                    </p>
                    <h2 className="text-xl font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7]">
                      {cat.title}
                    </h2>
                    <p className="mt-0.5 text-xs font-light text-[#5c85a0] dark:text-[#7a9baf]">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mx-5 h-px bg-[#dde8f0] dark:bg-[#1a2d3e]" />

                <div className="flex flex-1 flex-col gap-1.5 px-4 pb-5 pt-3 sm:px-5">
                  {loading ? (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
                      ))}
                    </>
                  ) : (
                    <>
                      <AnimatePresence>
                        {group.slice(0, 5).map((meal, mealIdx) => (
                          <motion.button
                            key={meal.id}
                            custom={mealIdx}
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                            type="button"
                            aria-label={`View details for ${meal.name}`}
                            onClick={() => handleMealClick(meal.id)}
                            onTouchStart={() => setPressedId(meal.id)}
                            onTouchEnd={() => setPressedId(null)}
                            onMouseDown={() => setPressedId(meal.id)}
                            onMouseUp={() => setPressedId(null)}
                            onMouseLeave={() => setPressedId(null)}
                            onKeyDown={(e) => handleKeyDown(e, meal.id)}
                            whileTap={{ scale: 0.97 }}
                            className={`
                              group/item relative flex w-full cursor-pointer items-center justify-between
                              overflow-hidden rounded-xl border px-4 text-left
                              outline-none transition-colors duration-150
                              min-h-[52px] py-3
                              border-[#e2edf5] bg-[#f8fbfd]
                              text-sm font-medium text-[#0d2233]
                              dark:border-[#1a2d3e] dark:bg-[#0d1a26] dark:text-[#ddeef7]
                              hover:border-[#2a7db5]/50 hover:bg-[#eef6fc]
                              dark:hover:border-[#2a7db5]/40 dark:hover:bg-[#0f2235]
                              focus-visible:ring-2 focus-visible:ring-[#2a7db5] focus-visible:ring-offset-2
                              dark:focus-visible:ring-offset-[#0a1520]
                              ${pressedId === meal.id ? 'bg-[#e4f1f9] border-[#2a7db5]/60 dark:bg-[#0c1e30]' : ''}
                            `}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <span
                              className={`
                                absolute left-0 top-0 h-full w-[3px] rounded-r-full
                                bg-[#2a7db5] transition-transform duration-150 origin-left
                                ${pressedId === meal.id ? 'scale-x-100' : 'scale-x-0'}
                                group-hover/item:scale-x-100
                              `}
                            />

                            <span className="truncate pr-3 pl-1">{meal.name}</span>

                            <ChevronRight
                              size={18}
                              className="
                                shrink-0 text-[#2a7db5]
                                transition-all duration-200
                                opacity-60
                                md:opacity-0 md:-translate-x-1
                                group-hover/item:opacity-100 group-hover/item:translate-x-0
                              "
                            />
                          </motion.button>
                        ))}
                      </AnimatePresence>

                      {count > 5 && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          type="button"
                          className="
                            mt-1 flex w-full items-center justify-center gap-1.5
                            rounded-xl border border-dashed border-[#ccdfe9] py-3
                            text-xs font-medium text-[#5c85a0]
                            transition-colors duration-150
                            hover:border-[#2a7db5]/50 hover:bg-[#f2f8fc] hover:text-[#2a7db5]
                            active:scale-[0.98]
                            dark:border-[#1a2d3e] dark:text-[#7a9baf]
                            dark:hover:border-[#2a7db5]/40 dark:hover:bg-[#0f2235] dark:hover:text-[#5b9ec9]
                            min-h-[44px]
                          "
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <ChevronRight size={13} className="rotate-90" />
                          {count - 5} more options
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default MealsPage;