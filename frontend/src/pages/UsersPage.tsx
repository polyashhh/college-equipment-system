import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import '../styles/users.css'

type User = {
  id: number
  name: string
  email: string
  role_id: number | null
  is_blocked: boolean | null
  created_at: string | null
}
const API = 'http://localhost:3000'

const roles: Record<number, string> = {
  1: 'Администратор',
  2: 'Лаборант',
  3: 'Преподаватель',
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Все')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState<number | null>(null)
  const token = localStorage.getItem('token')
  const isAdmin =
    localStorage.getItem('role') === 'Администратор'

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }
    fetch(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Нет доступа к пользователям')
        }
        return response.json()
      })
      .then((data: User[]) => setUsers(data))
      .catch(() => setError('Не удалось загрузить пользователей'))
      .finally(() => setLoading(false))
  }, [isAdmin, token])

  const changeRole = async (id: number, roleId: number) => {
    if (!window.confirm('Изменить роль пользователя?')) return
    setSavingId(id)
    try {
      const response = await fetch(`${API}/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role_id: roleId,
        }),
      })
      if (!response.ok) {
        throw new Error('Ошибка изменения роли')
      }
      setUsers(current =>
        current.map(user =>
          user.id === id
            ? { ...user, role_id: roleId }
            : user
        )
      )
    } catch {
      alert('Не удалось изменить роль пользователя')
    } finally {
      setSavingId(null)
    }
  }

  const toggleBlock = async (user: User) => {
    const action = user.is_blocked
      ? 'разблокировать'
      : 'заблокировать'
    if (!window.confirm(`Точно ${action} пользователя?`)) {
      return
    }
    setSavingId(user.id)
    try {
      const response = await fetch(
        `${API}/users/${user.id}/block`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error('Ошибка изменения статуса')
      }
      const data: { is_blocked: boolean } =
        await response.json()
      setUsers(current =>
        current.map(item =>
          item.id === user.id
            ? { ...item, is_blocked: data.is_blocked }
            : item
        )
      )
    } catch {
      alert('Не удалось изменить статус пользователя')
    } finally {
      setSavingId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const query = search.toLowerCase()
    const roleName = user.role_id
      ? roles[user.role_id] || 'Неизвестная роль'
      : 'Без роли'
    return (
      (user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)) &&
      (role === 'Все' || roleName === role)
    )
  })
  if (!isAdmin) {
    return (
      <div className="users-page">
        <header className="users-header">
          <h1>Пользователи</h1>
          <p>Управление пользователями системы</p>
        </header>
        <Card>
          <p>
            Доступ к управлению пользователями
            есть только у администратора
          </p>
        </Card>
      </div>
    )
  }
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
        {loading && <p>Загрузка пользователей...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Имя</th>
                    <th>Электронная почта</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Select
                          value={String(user.role_id || '')}
                          onChange={e =>
                            changeRole(user.id, Number(e.target.value))
                          }
                          disabled={savingId !== null}
                        >
                          <option value="">Без роли</option>
                          {Object.entries(roles).map(
                            ([id, name]) => (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            )
                          )}
                        </Select>
                      </td>
                      <td>
                        <Badge
                          variant={
                            user.is_blocked ? 'danger' : 'success'
                          }
                        >
                          {user.is_blocked
                            ? 'Заблокирован'
                            : 'Активен'}
                        </Badge>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={
                            user.is_blocked
                              ? 'user-unblock'
                              : 'user-block'
                          }
                          disabled={savingId !== null}
                          onClick={() => toggleBlock(user)}
                        >
                          {user.is_blocked
                            ? 'Разблокировать'
                            : 'Заблокировать'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <p className="users-empty">
                Пользователи не найдены
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  )
}