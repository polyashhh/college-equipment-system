import { useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import '../styles/users.css'

//Тестовые
const users = [
  { id: 1, name: 'Иванов Иван', email: 'ivanov@college.ru', role: 'Преподаватель', status: 'Активен' },
  { id: 2, name: 'Петрова Анна', email: 'petrova@college.ru', role: 'Лаборант', status: 'Активен' },
  { id: 3, name: 'Сидоров Пётр', email: 'sidorov@college.ru', role: 'Администратор', status: 'Активен' },
  { id: 4, name: 'Кузнецова Мария', email: 'kuznetsova@college.ru', role: 'Преподаватель', status: 'Неактивен' },
  { id: 5, name: 'Смирнов Дмитрий', email: 'smirnov@college.ru', role: 'Лаборант', status: 'Активен' },
]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Все')
  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())) &&
    (role === 'Все' || user.role === role)
  )
  return (
    <div className="users-page">
      <header className="users-header">
        <h1>Пользователи</h1>
        <p>Список пользователей системы учёта оборудования</p>
      </header>
      <Card>
        <div className="users-filters">
          <Input
            placeholder="Поиск по имени или почте"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="Все">Все роли</option>
            <option value="Преподаватель">Преподаватель</option>
            <option value="Лаборант">Лаборант</option>
            <option value="Администратор">Администратор</option>
          </Select>
        </div>
      </Card>
      <Card>
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Электронная почта</th>
                <th>Роль</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Badge variant={user.status === 'Активен' ? 'success' : 'danger'}>
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <p className="users-empty">Пользователи не найдены</p>
        )}
      </Card>
    </div>
  )
}