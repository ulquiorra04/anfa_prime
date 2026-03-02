import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import MealPage from "./pages/MealsPage";
import MenuPage from "./pages/MenuPage";
import RecapPage from "./pages/RecapPage";
import NotFound from "./pages/NotFound";
import './App.css';

function App() {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900">
      <Router>
        <div className="h-full">
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/meal" element={<MealPage />} />
            <Route path="/meal/:id" element={<MenuPage />} />
            <Route path="/recap" element={<RecapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;