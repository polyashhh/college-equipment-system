//временно указаны имя пользователя и роль

import { NavLink, Outlet } from 'react-router-dom'
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

export function AppLayout() {
    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo" />
                    <span>College Equipment</span>
                </div>
                <nav className="sidebar-menu">
                    {menuItems.map((item) => (
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
                    <div className="profile-avatar">П</div>
                    <div>
                        <strong>Полина</strong>
                        <span>Администратор</span>
                    </div>
                </div>
            </aside>
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    )
}