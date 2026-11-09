import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import '../styles/dashboard.css'

//Тестовые. После подключения к API будут заменены 
const stats = [
  { title: 'Всего оборудования', value: 120, note: 'В 18 аудиториях' },
  { title: 'Доступно', value: 85, note: '71% от общего' },
  { title: 'Выдано', value: 25, note: '12 преподавателям' },
  { title: 'Ожидают заявки', value: 7, note: 'Требуют обработки' },
]
const activities = [
  {
    icon: '↗',
    type: 'issue',
    title: 'Выдан проектор Epson',
    description: 'Преподаватель · Иван Иванов',
    time: '10:42',
  },
  {
    icon: '▤',
    type: 'request',
    title: 'Создана новая заявка',
    description: 'Оборудование для аудитории 304',
    time: '10:15',
  },
  {
    icon: '⇄',
    type: 'move',
    title: 'Оборудование перемещено',
    description: 'Из аудитории 210 в 304',
    time: '09:58',
  },
  {
    icon: '+',
    type: 'add',
    title: 'Добавлен новый ноутбук',
    description: 'Лаборант · Анна Смирнова',
    time: '09:21',
  },
]
const requests = [
  { id: 42, equipment: 'Проектор Epson', status: 'Ожидает', variant: 'warning' },
  { id: 41, equipment: 'Ноутбук Lenovo', status: 'Одобрено', variant: 'success' },
  { id: 39, equipment: 'Камера Sony', status: 'На проверке', variant: 'warning' },
] as const

export function DashboardPage() {
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
            <Button variant="primary">Оборудование</Button>
          </Link>
        </div>
      </header>
      <section className="dashboard-stats">
        {stats.map((item) => (
          <Card key={item.title}>
            <div className="dashboard-stat-label">{item.title}</div>
            <div className="dashboard-stat-value">{item.value}</div>
            <div className="dashboard-stat-note">{item.note}</div>
          </Card>
        ))}
      </section>
      <section className="dashboard-activity-section">
        <Card>
          <div className="dashboard-activity-header">
            <h2>Последние действия</h2>
            <span>Журнал событий</span>
          </div>
          <div className="dashboard-activity-list">
            {activities.map((item) => (
              <div className="dashboard-activity" key={item.title}>
                <div className={`dashboard-activity-icon activity-${item.type}`}>
                  {item.icon}
                </div>
                <div className="dashboard-activity-info">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
                <span className="dashboard-activity-time">{item.time}</span>
              </div>
            ))}
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
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>#{request.id}</td>
                    <td>{request.equipment}</td>
                    <td>
                      <Badge variant={request.variant}>
                        {request.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2>Быстрые действия</h2>
          <div className="dashboard-quick-actions">
            <Link to="/equipment">Управление оборудованием</Link>
            <Link to="/rooms">Создать аудиторию</Link>
            <Link to="/requests">Открыть заявки</Link>
            <Link to="/users">Управление пользователями</Link>
          </div>
        </Card>
      </section>
    </div>
  )
}