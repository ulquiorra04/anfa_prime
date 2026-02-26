import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import MealPage from "./pages/MealsPage";
import MenuPage from "./pages/MenuPage";
import RecapPage from "./pages/RecapPage";
import NotFound from "./pages/NotFound";
import ('../src/i18n/i18n');

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<OrderPage />} />
          <Route path="/meal" element={<MealPage />} />
          <Route path="/meal/:id" element={<MenuPage />} />
          <Route path="/recap" element={<RecapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;