// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import MealPage from './pages/meal.tsx'
// import MenuPage from './pages/menu.tsx'
// import Accueil from './pages/accueil.tsx'
// import OrderPage from './pages/order.tsx'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       { index: true, element: <Accueil /> },
//       { path: '/orders', element: <OrderPage /> },
//       { path: '/meal', element: <MealPage /> },
//       { path: '/menu/:meal', element: <MenuPage /> },
//     ],
//   },
// ]);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// )




import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';

const container = document.getElementById('root');

if (!container) throw new Error("Root element not found");

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);


