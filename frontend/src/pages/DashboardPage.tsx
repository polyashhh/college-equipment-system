import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import '../styles/dashboard.css'

type Equipment = {
  id: number
  name: string
  inventory_number: string
  status: string | null
  room_id: number | null
  created_at: string | null
}

type Room = {
  id: number
}

type Request = {
  id: number
  status: string | null
  created_at: string | null
  request_items: {
    equipment: {
      name: string
    } | null
  }[]
}

const API = 'http://localhost:3000'
const statusNames: Record<string, string> = {
  pending: 'Ожидает',
  approved: 'Одобрена',
  rejected: 'Отклонена',
}

export function DashboardPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all([
          fetch(`${API}/equipment`),
          fetch(`${API}/rooms`),
          fetch(`${API}/requests`),
        ])
        if (responses.some(response => !response.ok)) {
          throw new Error('Ошибка сервера')
        }
        const [equipmentData, roomsData, requestsData] =
          await Promise.all(
            responses.map(response => response.json())
          )
        setEquipment(equipmentData)
        setRooms(roomsData)
        setRequests(requestsData)
      } catch {
        setError('Не удалось загрузить данные дашборда')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const total = equipment.length

  const available = equipment.filter(
    item => item.status === 'available'
  ).length

  const inUse = equipment.filter(
    item => item.status === 'in_use'
  ).length

  const pending = requests.filter(
    item => item.status === 'pending'
  ).length

  const availablePercent = total
    ? Math.round((available / total) * 100)
    : 0

  const stats = [
    {
      title: 'Всего оборудования',
      value: total,
      note: `В системе ${rooms.length} аудиторий`,
    },
    {
      title: 'Доступно',
      value: available,
      note: `${availablePercent}% от общего количества`,
    },
    {
      title: 'Выдано',
      value: inUse,
      note: 'Оборудование в использовании',
    },
    {
      title: 'Ожидают заявки',
      value: pending,
      note: 'Требуют обработки',
    },
  ]

  const recentEquipment = [...equipment]
    .sort((a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    )
    .slice(0, 4)

  const recentRequests = [...requests]
    .filter(request => request.status === 'pending')
    .sort((a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    )
    .slice(0, 5)
  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Загрузка дашборда...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="dashboard-page">
        <p>{error}</p>
      </div>
    )
  }
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Дашборд</h1>
          <p>Сводная информация по оборудованию и заявкам</p>
        </div>
        <div className="dashboard-actions">
          <Button disabled>Экспорт</Button>
          <Link to="/equipment">
            <Button variant="primary">
              Оборудование
            </Button>
          </Link>
        </div>
      </header>
      <section className="dashboard-stats">
        {stats.map(item => (
          <Card key={item.title}>
            <div className="dashboard-stat-label">
              {item.title}
            </div>
            <div className="dashboard-stat-value">
              {item.value}
            </div>
            <div className="dashboard-stat-note">
              {item.note}
            </div>
          </Card>
        ))}
      </section>
      <section className="dashboard-activity-section">
        <Card>
          <div className="dashboard-activity-header">
            <h2>Последнее добавленное оборудование</h2>
            <span>Данные из PostgreSQL</span>
          </div>
          <div className="dashboard-activity-list">
            {recentEquipment.map(item => (
              <div
                className="dashboard-activity"
                key={item.id}
              >
                <div className="dashboard-activity-icon activity-add">
                  +
                </div>
                <div className="dashboard-activity-info">
                  <strong>{item.name}</strong>
                  <span>
                    Инвентарный номер: {item.inventory_number}
                  </span>
                </div>
                <span className="dashboard-activity-time">
                  {item.created_at
                    ? new Date(item.created_at)
                        .toLocaleDateString('ru-RU')
                    : '—'}
                </span>
              </div>
            ))}
            {recentEquipment.length === 0 && (
              <p>Оборудование пока не добавлено</p>
            )}
          </div>
        </Card>
      </section>
      <section className="dashboard-bottom-grid">
        <Card>
          <h2>Активные заявки</h2>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Оборудование</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id}>
                    <td>#{request.id}</td>
                    <td>
                      {request.request_items
                        .map(item => item.equipment?.name)
                        .filter(Boolean)
                        .join(', ') || 'Не указано'}
                    </td>
                    <td>
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'success'
                            : request.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {request.status
                          ? statusNames[request.status] ||
                            request.status
                          : 'Не указан'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentRequests.length === 0 && (
            <p>Нет ожидающих заявок</p>
          )}
        </Card>
        <Card>
          <h2>Быстрые действия</h2>
          <div className="dashboard-quick-actions">
            <Link to="/equipment">
              Управление оборудованием
            </Link>
            <Link to="/rooms">
              Создать аудиторию
            </Link>
            <Link to="/requests">
              Открыть заявки
            </Link>
            <Link to="/users">
              Управление пользователями
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}