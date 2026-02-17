import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Utensils, ArrowUpRight } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import type { MealDto } from './MenuPage';
import { CATEGORIES } from '@/models/order';

const MealsPage = () => {
  const [meals, setMeals] = useState<MealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) throw new Error('MealsPage must be used within a ThemeProvider');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('data/meals.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
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
    if (e.key === 'Enter' || e.key === ' ') handleMealClick(id);
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
    <div className="min-h-screen bg-[#f4f9fd] px-5 py-10 transition-colors duration-300 dark:bg-[#0a1520] sm:py-14">
      <div className="mx-auto max-w-7xl">

        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#5c85a0] dark:text-[#7a9baf]">
            <Utensils size={13} className="text-[#2a7db5]" />
            Today's Menu
          </div>
          <h1 className="mb-3 text-[clamp(2.2rem,6vw,3.8rem)] font-bold leading-[1.1] text-[#0d2233] dark:text-[#ddeef7]">
            Choose your{' '}
            <em className="italic text-[#2a7db5]">meal</em>
          </h1>
          <p className="text-base font-light leading-relaxed text-[#5c85a0] dark:text-[#7a9baf]">
            Balanced, nutritious options prepared for your well-being — morning to evening.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-12 rounded bg-[#2a7db5]" />
        </header>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {CATEGORIES.map((cat, idx) => {
            const group = mealGroups[idx] ?? [];
            const count = group.length;

            return (
              <article
                key={idx}
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

                <div className="flex flex-1 flex-col gap-1.5 px-5 pb-5 pt-4">
                  {loading ? (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-11 w-full rounded-lg bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
                      ))}
                    </>
                  ) : (
                    <>
                      {group.slice(0, 5).map((meal) => (
                        <div
                          key={meal.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${meal.name}`}
                          onClick={() => handleMealClick(meal.id)}
                          onMouseEnter={() => setHoveredId(meal.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onKeyDown={(e) => handleKeyDown(e, meal.id)}
                          className={`group/item flex cursor-pointer items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-[#0d2233] outline-none transition-all duration-200 hover:translate-x-0.5 hover:border-[#ccdfe9] hover:bg-[#f2f8fc] focus-visible:ring-2 focus-visible:ring-[#2a7db5] focus-visible:ring-offset-2 active:scale-[0.99] dark:text-[#ddeef7] dark:hover:border-[#1a2d3e] dark:hover:bg-[#0d1a26] dark:focus-visible:ring-offset-[#0a1520]`}
                        >
                          <span className="truncate pr-2">{meal.name}</span>
                          <ArrowUpRight
                            size={15}
                            className="shrink-0 text-[#2a7db5] opacity-0 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:opacity-100"
                          />
                        </div>
                      ))}

                      {count > 5 && (
                        <p className="pt-1 text-center text-xs text-[#7a9baf]">
                          + {count - 5} more
                        </p>
                      )}
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealsPage;
