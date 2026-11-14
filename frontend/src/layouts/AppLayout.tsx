import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import '../styles/layout.css'

const menuItems = [
  { path: '/dashboard', label: 'Дашборд' },
  { path: '/equipment', label: 'Оборудование' },
  { path: '/rooms', label: 'Аудитории' },
  { path: '/categories', label: 'Категории' },
  { path: '/requests', label: 'Заявки' },
  { path: '/users', label: 'Пользователи' },
  { path: '/transactions', label: 'История перемещений' },
]

function getUserInfo() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const data = JSON.parse(
      new TextDecoder('utf-8').decode(bytes)
    )
    return {
      email: String(data.email || ''),
      role: String(data.role || ''),
    }
  } catch {
    return null
  }
}

export function AppLayout() {
  const navigate = useNavigate()
  const user = getUserInfo()
  const email = user?.email || 'Пользователь'
  const role = user?.role || 'Роль не указана'
  const avatarLetter = email.charAt(0).toUpperCase()
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login', { replace: true })
  }
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo" />
          <span>College Equipment</span>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'sidebar-link sidebar-link-active'
                  : 'sidebar-link'
              }
            >
              <span className="sidebar-dot" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {avatarLetter}
          </div>
          <div className="sidebar-user-info">
            <strong>{email}</strong>
            <span>{role}</span>
          </div>
          <button
            className="sidebar-logout"
            type="button"
            onClick={logout}
          >
            Выйти
          </button>
        </div>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}