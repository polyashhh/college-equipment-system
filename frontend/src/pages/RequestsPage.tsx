import { useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import '../styles/requests.css'

//Тестовые
const requests = [
  { id: 1, equipment: 'Проектор Epson', user: 'Иванов И.И.', date: '05.11.2026', status: 'Ожидает' },
  { id: 2, equipment: 'Ноутбук Lenovo', user: 'Петрова А.А.', date: '04.11.2026', status: 'Одобрена' },
  { id: 3, equipment: 'Монитор Samsung', user: 'Сидоров П.П.', date: '03.11.2026', status: 'Отклонена' },
  { id: 4, equipment: 'Принтер HP', user: 'Кузнецова М.В.', date: '02.11.2026', status: 'Одобрена' },
  { id: 5, equipment: 'Проектор BenQ', user: 'Смирнов Д.А.', date: '01.11.2026', status: 'Ожидает' },
]

export function RequestsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Все')
  const filteredRequests = requests.filter(request =>
    (request.equipment.toLowerCase().includes(search.toLowerCase()) ||
      request.user.toLowerCase().includes(search.toLowerCase())) &&
    (status === 'Все' || request.status === status)
  )
  return (
    <div className="requests-page">
      <header className="requests-header">
        <h1>Заявки на оборудование</h1>
        <p>Просмотр заявок на выдачу техники колледжа</p>
      </header>
      <Card>
        <div className="requests-filters">
          <Input
            placeholder="Поиск по оборудованию или пользователю"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="Все">Все статусы</option>
            <option value="Ожидает">Ожидает</option>
            <option value="Одобрена">Одобрена</option>
            <option value="Отклонена">Отклонена</option>
          </Select>
        </div>
      </Card>
      <Card>
        <div className="requests-table-wrap">
          <table className="requests-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Оборудование</th>
                <th>Пользователь</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.equipment}</td>
                  <td>{request.user}</td>
                  <td>{request.date}</td>
                  <td>
                    <Badge
                      variant={
                        request.status === 'Одобрена'
                          ? 'success'
                          : request.status === 'Отклонена'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {request.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRequests.length === 0 && (
          <p className="requests-empty">Заявки не найдены</p>
        )}
      </Card>
    </div>
  )
}
