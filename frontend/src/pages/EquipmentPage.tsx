import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import '../styles/equipment.css'

//Тестовые
export const equipment = [
  { id: 1, name: 'Ноутбук Lenovo', number: 'INV-001', category: 'Ноутбуки', room: '101', status: 'Доступно' },
  { id: 2, name: 'Проектор Epson', number: 'INV-002', category: 'Проекторы', room: '210', status: 'Выдано' },
  { id: 3, name: 'Монитор Samsung', number: 'INV-003', category: 'Мониторы', room: '101', status: 'Доступно' },
  { id: 4, name: 'Принтер HP', number: 'INV-004', category: 'Принтеры', room: '304', status: 'На ремонте' },
  { id: 5, name: 'Компьютер Acer', number: 'INV-005', category: 'Компьютеры', room: '312', status: 'Доступно' },
]

export function EquipmentPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [status, setStatus] = useState('Все')
  const filteredEquipment = equipment.filter(item =>
    (item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.number.toLowerCase().includes(search.toLowerCase())) &&
    (category === 'Все' || item.category === category) &&
    (status === 'Все' || item.status === status)
  )
  return (
    <div className="equipment-page">
      <header className="equipment-header">
        <h1>Оборудование</h1>
        <p>Список оборудования колледжа</p>
      </header>
      <Card>
        <div className="equipment-filters">
          <Input
            placeholder="Поиск по названию или номеру"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="Все">Все категории</option>
            <option value="Ноутбуки">Ноутбуки</option>
            <option value="Проекторы">Проекторы</option>
            <option value="Мониторы">Мониторы</option>
            <option value="Принтеры">Принтеры</option>
            <option value="Компьютеры">Компьютеры</option>
          </Select>
          <Select
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="Все">Все состояния</option>
            <option value="Доступно">Доступно</option>
            <option value="Выдано">Выдано</option>
            <option value="На ремонте">На ремонте</option>
          </Select>
        </div>
      </Card>
      <Card>
        <div className="equipment-table-wrap">
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Инв. номер</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Аудитория</th>
                <th>Состояние</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map(item => (
                <tr key={item.id}>
                  <td>{item.number}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.room}</td>
                  <td>
                    <Badge
                      variant={
                        item.status === 'Доступно'
                          ? 'success'
                          : item.status === 'Выдано'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td>
                    <Link to={`/equipment/${item.id}`} className="equipment-link">
                      Подробнее
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEquipment.length === 0 && (
          <p className="equipment-empty">Оборудование не найдено</p>
        )}
      </Card>
    </div>
  )
}