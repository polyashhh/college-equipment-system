import { useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import '../styles/rooms.css'

//Тестовые 
const rooms = [
  { id: 1, number: '101', name: 'Компьютерный класс', type: 'Компьютерная', equipment: 18 },
  { id: 2, number: '115', name: 'Медиалаборатория', type: 'Лаборатория', equipment: 12 },
  { id: 3, number: '210', name: 'Лекционная аудитория', type: 'Учебная', equipment: 8 },
  { id: 4, number: '304', name: 'Мультимедийный кабинет', type: 'Учебная', equipment: 15 },
  { id: 5, number: '312', name: 'Компьютерный класс №2', type: 'Компьютерная', equipment: 20 },
  { id: 6, number: '405', name: 'Кабинет преподавателей', type: 'Служебная', equipment: 6 },
]

export function RoomsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('Все')
  const filteredRooms = rooms.filter(room =>
    (room.number.includes(search) ||
      room.name.toLowerCase().includes(search.toLowerCase())) &&
    (type === 'Все' || room.type === type)
  )
  return (
    <div className="rooms-page">
      <header className="rooms-header">
        <h1>Аудитории</h1>
        <p>Информация об учебных помещениях колледжа</p>
      </header>
      <Card>
        <div className="rooms-filters">
          <Input
            placeholder="Поиск по номеру или названию"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="Все">Все типы</option>
            <option value="Учебная">Учебная</option>
            <option value="Компьютерная">Компьютерная</option>
            <option value="Лаборатория">Лаборатория</option>
            <option value="Служебная">Служебная</option>
          </Select>
        </div>
      </Card>
      <div className="rooms-grid">
        {filteredRooms.map(room => (
          <Card key={room.id}>
            <div className="room-card-top">
              <div className="room-number">{room.number}</div>
              <span className="room-type">{room.type}</span>
            </div>
            <h2>{room.name}</h2>
            <div className="room-equipment">
              <span>Оборудование</span>
              <strong>{room.equipment} ед.</strong>
            </div>
          </Card>
        ))}
      </div>
      {filteredRooms.length === 0 && (
        <p className="rooms-empty">Аудитории не найдены</p>
      )}
    </div>
  )
}