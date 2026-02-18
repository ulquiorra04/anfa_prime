import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import OrderPage from "./pages/OrderPage";
import MealPage from "./pages/MealsPage";
import MenuPage from "./pages/MenuPage";
import RecapPage from "./pages/RecapPage";
import Accueil from "./pages/accueil";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/meal" element={<MealPage />} />
        <Route path="/meal/:id" element={<MenuPage />} />
        <Route path="/recap" element={<RecapPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;