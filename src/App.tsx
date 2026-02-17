import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import OrderPage from "./pages/OrderPage";
import MealPage from "./pages/MealsPage";
import { Menu } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />

        <Routes>
          <Route path="/order" element={<OrderPage />} />
          <Route path="/meal" element={<MealPage />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
