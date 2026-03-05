import { Outlet } from 'react-router-dom';
import Navbar from './navbar/Navbar';

const MainLayout = () => {
  return (
    <main className="min-h-screen bg-[#f4f9fd] dark:bg-[#0a1520]">
      <Navbar />
      <Outlet />
      </main>
  );
};

export default MainLayout;