import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Utensils, ChevronRight, ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import type { MealsDto } from '@/models/meal';

// Palette of accent colors to cycle through per card
const CARD_ACCENTS = [
  {
    bar: 'from-[#2a7db5] to-[#56b4e9]',
    iconBg: 'bg-[#eaf4fb] dark:bg-[#0d2233]',
    iconBorder: 'border-[#b3d6ed] dark:border-[#1a3a52]',
    iconColor: 'text-[#2a7db5]',
  },
  {
    bar: 'from-[#e07b39] to-[#f5b87a]',
    iconBg: 'bg-[#fdf3eb] dark:bg-[#2a1500]',
    iconBorder: 'border-[#f0c89a] dark:border-[#4a2800]',
    iconColor: 'text-[#e07b39]',
  },
  {
    bar: 'from-[#3aaa7e] to-[#74d4ab]',
    iconBg: 'bg-[#eaf7f2] dark:bg-[#001f12]',
    iconBorder: 'border-[#a3dfc6] dark:border-[#0a3d24]',
    iconColor: 'text-[#3aaa7e]',
  },
  {
    bar: 'from-[#9b59b6] to-[#c39bd3]',
    iconBg: 'bg-[#f5edfb] dark:bg-[#1a0028]',
    iconBorder: 'border-[#d7b8eb] dark:border-[#3a0060]',
    iconColor: 'text-[#9b59b6]',
  },
  {
    bar: 'from-[#e74c3c] to-[#f1948a]',
    iconBg: 'bg-[#fdf0ef] dark:bg-[#2a0000]',
    iconBorder: 'border-[#f5b7b1] dark:border-[#5a0000]',
    iconColor: 'text-[#e74c3c]',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
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
  const [meals, setMeals] = useState<MealsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) throw new Error('MealsPage must be used within a ThemeProvider');

  useEffect(() => {
    const fetchmeals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_MEALS}`
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data: MealsDto[] = await response.json();
        setMeals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load meals');
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
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleMealsClick(meal);
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

  // Determine grid cols class based on count
  const colsClass =
    meals.length === 1
      ? 'grid-cols-1 max-w-sm mx-auto'
      : meals.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : meals.length === 4
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-[#f4f9fd] px-4 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:px-5 sm:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Back button */}
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

        {/* Header */}
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

        {/* Skeleton grid while loading */}
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
                  {/* Accent bar */}
                  <div className={`h-1 w-full bg-linear-to-r ${accent.bar}`} />

                  {/* Card header */}
                  <div className="flex items-center gap-3 px-5 pb-4 pt-5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent.iconBg} ${accent.iconBorder} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    >
                      <Utensils size={20} className={accent.iconColor} strokeWidth={1.8} />
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

                  {/* CTA button */}
                  <div className="flex flex-1 flex-col px-4 pb-5 pt-3 sm:px-5">
                    <motion.button
                      key={cat.id}
                      type="button"
                      aria-label={`Select ${cat.name}`}
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
                        min-h-[52px] py-3
                        border-[#e2edf5] bg-[#f8fbfd]
                        text-sm font-medium text-[#0d2233]
                        dark:border-[#1a2d3e] dark:bg-[#0d1a26] dark:text-[#ddeef7]
                        hover:border-[#2a7db5]/50 hover:bg-[#eef6fc]
                        dark:hover:border-[#2a7db5]/40 dark:hover:bg-[#0f2235]
                        focus-visible:ring-2 focus-visible:ring-[#2a7db5] focus-visible:ring-offset-2
                        dark:focus-visible:ring-offset-[#0a1520]
                        ${pressedId === String(cat.id) ? 'bg-[#e4f1f9] border-[#2a7db5]/60 dark:bg-[#0c1e30]' : ''}
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <span
                        className={`
                          absolute left-0 top-0 h-full w-[3px] rounded-r-full
                          bg-[#2a7db5] transition-transform duration-150 origin-left
                          ${pressedId === String(cat.id)? 'scale-x-100' : 'scale-x-0'}
                          group-hover/item:scale-x-100
                        `}
                      />
                      <span className="truncate pl-1 pr-3">View {cat.name} meals</span>
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
      </div>
    </div>
  );
};

export default MealsPage;