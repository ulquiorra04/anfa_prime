import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Coffee, Soup, Pizza, ArrowRight, ChevronRight, Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export interface MealDto {
  id: number;
  name: string;
}

const MealsPage = () => {
  const [meals, setMeals] = useState<MealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMealId, setHoveredMealId] = useState<number | null>(null);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);

  // Handle case when ThemeContext is not available
  if (!themeContext) {
    throw new Error('MealsPage must be used within a ThemeProvider');
  }

  const { darkMode, toggleTheme } = themeContext;

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

  // Define card categories with icons and colors (adapted for dark mode)
  const cardCategories = [
    { 
      title: 'Breakfast', 
      icon: Coffee,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
      textColor: 'text-amber-600 dark:text-amber-400',
      description: 'Start your day with delicious breakfast options'
    },
    { 
      title: 'Lunch', 
      icon: Soup,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/40',
      textColor: 'text-green-600 dark:text-green-400',
      description: 'Midday meals to keep you energized'
    },
    { 
      title: 'Dinner', 
      icon: Pizza,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
      textColor: 'text-purple-600 dark:text-purple-400',
      description: 'Evening feasts for a perfect ending'
    }
  ];

  // Split meals into three groups
  const mealsPerCard = Math.ceil(meals.length / 3);
  const mealGroups = [
    meals.slice(0, mealsPerCard),
    meals.slice(mealsPerCard, mealsPerCard * 2),
    meals.slice(mealsPerCard * 2)
  ];

  const handleMealClick = (mealId: number) => {
    navigate(`/meal/${mealId}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent, mealId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleMealClick(mealId);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900">
        <Alert variant="destructive" className="max-w-md dark:bg-red-950 dark:border-red-800 dark:text-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900 py-8 sm:py-12 px-3 sm:px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Theme Toggle */}
        <div className="text-center mb-8 sm:mb-12 relative">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="absolute right-0 top-0 rounded-full dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="inline-flex items-center justify-center p-2 bg-primary/10 dark:bg-primary/20 rounded-full mb-3 sm:mb-4">
            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-primary dark:text-primary-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600 mb-2 sm:mb-4">
            Our Delicious Meals
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto px-4">
            Discover our carefully curated selection of meals, organized by time of day
          </p>
        </div>

        {/* Cards Grid - Responsive layout with dark mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {cardCategories.map((category, index) => {
            const Icon = category.icon;
            const mealCount = mealGroups[index]?.length || 0;
            
            return (
              <Card 
                key={index} 
                className={`
                  group relative overflow-hidden border-2 
                  ${category.borderColor} 
                  hover:border-primary/50 
                  transition-all duration-300 
                  shadow-lg hover:shadow-2xl 
                  transform hover:-translate-y-1 sm:hover:-translate-y-2
                  dark:bg-gray-900/50 dark:backdrop-blur-sm
                  dark:border-opacity-50
                  dark:hover:border-primary/70
                `}
              >
                {/* Gradient Header - Enhanced for dark mode */}
                <div className={`h-2 sm:h-3 bg-gradient-to-r ${category.color} dark:opacity-80`} />
                
                <CardHeader className="text-center pb-2 px-3 sm:px-6">
                  <div className={`
                    mx-auto p-3 sm:p-4 rounded-full 
                    ${category.bgColor} 
                    mb-3 sm:mb-4 
                    group-hover:scale-110 transition-transform duration-300
                    dark:bg-opacity-20
                    dark:backdrop-blur-sm
                  `}>
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${category.textColor} dark:text-opacity-90`} />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold dark:text-white">
                    {category.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1 sm:mt-2 px-2">
                    {category.description}
                  </p>
                  
                  {/* Mobile-friendly meal count badge - Dark mode optimized */}
                  <div className="md:hidden absolute top-2 right-2">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-semibold 
                      ${category.bgColor} ${category.textColor}
                      dark:bg-opacity-30 dark:backdrop-blur-sm
                    `}>
                      {mealCount}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-3 sm:px-6">
                  {loading ? (
                    <div className="space-y-2 sm:space-y-3">
                      <Skeleton className="h-10 sm:h-12 w-full dark:bg-gray-800" />
                      <Skeleton className="h-10 sm:h-12 w-full dark:bg-gray-800" />
                      <Skeleton className="h-10 sm:h-12 w-full dark:bg-gray-800" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-3 sm:mb-4">
                        {mealGroups[index]?.slice(0, 4).map((meal) => (
                          <div
                            key={meal.id}
                            onClick={() => handleMealClick(meal.id)}
                            onMouseEnter={() => setHoveredMealId(meal.id)}
                            onMouseLeave={() => setHoveredMealId(null)}
                            onKeyDown={(e) => handleKeyPress(e, meal.id)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View details for ${meal.name}`}
                            className={`
                              flex items-center justify-between 
                              p-2 sm:p-3 
                              ${category.bgColor} bg-opacity-30 
                              rounded-lg 
                              ${category.hoverColor}
                              cursor-pointer 
                              transition-all duration-300 
                              group/item 
                              border-2 border-transparent 
                              hover:border-${category.borderColor}
                              hover:shadow-md
                              transform hover:scale-[1.02] active:scale-[0.98]
                              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                              dark:bg-opacity-10
                              dark:hover:bg-opacity-30
                              dark:focus:ring-offset-gray-900
                              dark:text-gray-200
                            `}
                          >
                            <span className="font-medium text-sm sm:text-base truncate mr-2">
                              {meal.name}
                            </span>
                            
                            {/* Enhanced Arrow Animation - Dark mode optimized */}
                            <div className="flex items-center space-x-1">
                              <span className={`
                                text-xs font-medium 
                                ${category.textColor} 
                                opacity-0 group-hover/item:opacity-100 
                                transition-all duration-300
                                transform 
                                ${hoveredMealId === meal.id ? 'translate-x-0 opacity-100' : '-translate-x-2'}
                                dark:text-opacity-90
                              `}>
                                View
                              </span>
                              <ArrowRight className={`
                                h-4 w-4 sm:h-5 sm:w-5
                                ${category.textColor}
                                transition-all duration-300
                                transform
                                ${hoveredMealId === meal.id ? 'translate-x-1 scale-110' : 'translate-x-0'}
                                group-hover/item:animate-pulse
                                dark:text-opacity-90
                              `} />
                              
                              {/* Second arrow for enhanced effect */}
                              <ChevronRight className={`
                                h-3 w-3 sm:h-4 sm:w-4
                                ${category.textColor}
                                transition-all duration-300
                                absolute right-8 sm:right-10
                                opacity-0 group-hover/item:opacity-50
                                transform -translate-x-2 group-hover/item:translate-x-0
                                hidden sm:block
                                dark:text-opacity-70
                              `} />
                            </div>

                            {/* Touch feedback for mobile - Dark mode optimized */}
                            <div className="absolute inset-0 bg-black opacity-0 active:opacity-10 dark:active:opacity-20 transition-opacity duration-150 rounded-lg sm:hidden" />
                          </div>
                        ))}
                      </div>

                      {/* Show more indicator for cards with more items */}
                      {mealCount > 4 && (
                        <div className="text-center mt-2 sm:mt-3">
                          <span className={`text-xs sm:text-sm ${category.textColor} opacity-75 dark:text-opacity-70`}>
                            +{mealCount - 4} more meals
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>

                {/* Desktop meal count badge - Dark mode optimized */}
                {!loading && mealCount > 0 && (
                  <div className="hidden md:block absolute top-4 right-4">
                    <span className={`
                      px-2 sm:px-3 py-1 
                      rounded-full 
                      text-xs font-semibold 
                      ${category.bgColor} 
                      ${category.textColor}
                      shadow-sm
                      dark:bg-opacity-20
                      dark:backdrop-blur-sm
                      dark:border dark:border-gray-700
                    `}>
                      {mealCount} {mealCount === 1 ? 'meal' : 'meals'}
                    </span>
                  </div>
                )}

                {/* Decorative Elements - Dark mode optimized */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 rounded-full" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent dark:from-white/5 rounded-full" />
                </div>

                {/* Interactive gradient overlay on hover - Dark mode optimized */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/0 group-hover:from-white/10 dark:group-hover:from-white/5 transition-all duration-500 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Floating Action Button for Mobile - Dark mode optimized */}
        {!loading && meals.length > 0 && (
          <div className="fixed bottom-6 right-6 md:hidden z-50">
            <Button
              size="lg"
              className="rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white p-4 h-auto dark:bg-primary-600 dark:hover:bg-primary-700"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="mr-2">{meals.length}</span>
              <UtensilsCrossed className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Scroll to top button for desktop - Dark mode optimized */}
        {!loading && meals.length > 0 && (
          <div className="hidden md:flex justify-center mt-8">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-md hover:shadow-lg transition-all dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowRight className="h-4 w-4 rotate-[-90deg] mr-2" />
              Back to top
            </Button>
          </div>
        )}

        {/* Dark mode subtle background pattern */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent dark:from-gray-900/50 dark:via-transparent dark:to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent dark:from-gray-900/50 dark:via-transparent dark:to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default MealsPage;