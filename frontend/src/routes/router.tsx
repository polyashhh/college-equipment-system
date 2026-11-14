import {
  createBrowserRouter,
  Navigate,
  Outlet,
} from 'react-router-dom'

import { AppLayout } from '../layouts/AppLayout'
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
import { TransactionsPage } from '../pages/TransactionsPage'

function isAuthenticated() {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const payload = token.split('.')[1]
    const data = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    )
    if (typeof data.exp !== 'number') {
      return false
    }
    return data.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
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
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
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
            path: '/transactions',
            element: <TransactionsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])