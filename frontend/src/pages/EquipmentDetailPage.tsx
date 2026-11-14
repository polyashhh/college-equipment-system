import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import '../styles/equipment-detail.css'

type Equipment = {
  id: number
  name: string
  inventory_number: string
  description: string | null
  status: string | null
  equipment_categories: {
    name: string
  } | null
  rooms: {
    number: string
  } | null
}

const statusNames: Record<string, string> = {
  available: 'Доступно',
  in_use: 'Выдано',
  issued: 'Выдано',
  repair: 'На ремонте',
  maintenance: 'На ремонте',
}

export function EquipmentDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/equipment/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Оборудование не найдено')
        return response.json()
      })
      .then((data: Equipment) => setItem(data))
      .catch(() => setError('Оборудование не найдено'))
      .finally(() => setLoading(false))
  }, [id])
  if (loading) {
    return <p>Загрузка оборудования...</p>
  }
  if (error || !item) {
    return (
      <div className="detail-page">
        <h1>{error || 'Оборудование не найдено'}</h1>
        <Link to="/equipment">Вернуться к списку</Link>
      </div>
    )
  }

  const status = item.status
    ? statusNames[item.status] || item.status
    : 'Не указан'
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
              item.status === 'available'
                ? 'success'
                : item.status === 'in_use' ||
                    item.status === 'issued'
                ? 'warning'
                : 'danger'
            }
          >
            {status}
          </Badge>
        </div>
        <div className="detail-info">
          <div>
            <span>Инвентарный номер</span>
            <strong>{item.inventory_number}</strong>
          </div>
          <div>
            <span>Название</span>
            <strong>{item.name}</strong>
          </div>
          <div>
            <span>Категория</span>
            <strong>
              {item.equipment_categories?.name || 'Без категории'}
            </strong>
          </div>
          <div>
            <span>Аудитория</span>
            <strong>{item.rooms?.number || 'Не назначена'}</strong>
          </div>
          <div>
            <span>Состояние</span>
            <strong>{status}</strong>
          </div>
          <div>
            <span>Описание</span>
            <strong>{item.description || 'Нет описания'}</strong>
          </div>
        </div>
      </Card>
    </div>
  )
}