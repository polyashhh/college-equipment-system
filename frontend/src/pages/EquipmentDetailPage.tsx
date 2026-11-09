import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { equipment } from './EquipmentPage' //используются пока тестовые данные
import '../styles/equipment-detail.css'

export function EquipmentDetailPage() {
  const { id } = useParams()
  const item = equipment.find(item => item.id === Number(id))
  if (!item) {
    return (
      <div className="detail-page">
        <h1>Оборудование не найдено</h1>
        <Link to="/equipment">Вернуться к списку</Link>
      </div>
    )
  }
  return (
    <div className="detail-page">
      <Link to="/equipment" className="detail-back">
        ← Назад к оборудованию
      </Link>
      <header className="detail-header">
        <h1>{item.name}</h1>
        <p>Информация об оборудовании колледжа</p>
      </header>
      <Card>
        <div className="detail-top">
          <h2>Карточка оборудования</h2>
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
        </div>
        <div className="detail-info">
          <div>
            <span>Инвентарный номер</span>
            <strong>{item.number}</strong>
          </div>
          <div>
            <span>Название</span>
            <strong>{item.name}</strong>
          </div>
          <div>
            <span>Категория</span>
            <strong>{item.category}</strong>
          </div>
          <div>
            <span>Аудитория</span>
            <strong>{item.room}</strong>
          </div>
          <div>
            <span>Состояние</span>
            <strong>{item.status}</strong>
          </div>
        </div>
      </Card>
    </div>
  )
}