import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { EquipmentPage } from '../pages/EquipmentPage'
import { EquipmentDetailPage } from '../pages/EquipmentDetailPage'
import { RequestsPage } from '../pages/RequestsPage'
import { UsersPage } from '../pages/UsersPage'
import { RoomsPage } from '../pages/RoomsPage'
import { CategoriesPage } from '../pages/CategoriesPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/equipment',
    element: <EquipmentPage />,
  },
  {
    path: '/equipment/:id',
    element: <EquipmentDetailPage />,
  },
  {
    path: '/requests',
    element: <RequestsPage />,
  },
  {
    path: '/users',
    element: <UsersPage />,
  },
  {
    path: '/rooms',
    element: <RoomsPage />,
  },
  {
    path: '/categories',
    element: <CategoriesPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])