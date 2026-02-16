import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MealPage from './pages/meal.tsx'
import MenuPage from './pages/menu.tsx'
import Accueil from './pages/accueil.tsx'
import OrderPage from './pages/order.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Accueil /> },
      { path: '/orders', element: <OrderPage /> },
      { path: '/meal', element: <MealPage /> },
      { path: '/menu/:meal', element: <MenuPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
