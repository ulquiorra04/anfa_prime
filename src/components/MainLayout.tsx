import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <main className="min-h-screen bg-[#f4f9fd] dark:bg-[#0a1520]">
      <Outlet />
    </main>
  );
};

export default MainLayout;