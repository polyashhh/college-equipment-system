import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import '../styles/equipment.css'

type Category = {
  id: number
  name: string
}

type Room = {
  id: number
  number: string
  building: string
}

type Equipment = {
  id: number
  name: string
  inventory_number: string
  description: string | null
  status: string | null
  category_id: number | null
  room_id: number | null
  equipment_categories?: Category | null
  rooms?: Room | null
}

const API = 'http://localhost:3000'

const statuses: Record<string, string> = {
  available: 'Доступно',
  in_use: 'Выдано',
  repair: 'На ремонте',
}
export function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Все')
  const [statusFilter, setStatusFilter] = useState('Все')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [status, setStatus] = useState('available')

  const loadData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API}/equipment`),
        fetch(`${API}/categories`),
        fetch(`${API}/rooms`),
      ])
      if (responses.some(response => !response.ok)) {
        throw new Error('Ошибка сервера')
      }
      const [equipmentData, categoriesData, roomsData] =
        await Promise.all(responses.map(response => response.json()))
      setEquipment(equipmentData)
      setCategories(categoriesData)
      setRooms(roomsData)
      setError('')
    } catch {
      setError('Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setNumber('')
    setDescription('')
    setCategoryId('')
    setRoomId('')
    setStatus('available')
  }

  const openAddForm = () => {
    closeForm()
    setShowForm(true)
  }

  const editEquipment = (item: Equipment) => {
    setEditingId(item.id)
    setName(item.name)
    setNumber(item.inventory_number)
    setDescription(item.description || '')
    setCategoryId(item.category_id?.toString() || '')
    setRoomId(item.room_id?.toString() || '')
    setStatus(item.status || 'available')
    setShowForm(true)
  }

  const saveEquipment = async () => {
    if (!name.trim() || !number.trim() || !categoryId) {
      alert('Заполни название, инвентарный номер и категорию')
      return
    }
    const isEditing = editingId !== null
    setSaving(true)
    try {
      const response = await fetch(
        isEditing
          ? `${API}/equipment/${editingId}`
          : `${API}/equipment`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            inventory_number: number.trim(),
            description: description.trim(),
            category_id: Number(categoryId),
            room_id: roomId ? Number(roomId) : null,
            status,
          }),
        }
      )
      if (!response.ok) {
        throw new Error('Ошибка сохранения')
      }
      closeForm()
      await loadData()
    } catch {
      alert('Не удалось сохранить оборудование')
    } finally {
      setSaving(false)
    }
  }

  const deleteEquipment = async (id: number) => {
    if (!window.confirm('Точно удалить оборудование?')) return
    try {
      const response = await fetch(`${API}/equipment/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Ошибка удаления')
      if (editingId === id) closeForm()
      await loadData()
    } catch {
      alert('Не удалось удалить оборудование')
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.inventory_number.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === 'Все' ||
      String(item.category_id) === categoryFilter

    const matchesStatus =
      statusFilter === 'Все' || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })
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
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="Все">Все категории</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="Все">Все состояния</option>
            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <button
            className="equipment-add-button"
            onClick={showForm ? closeForm : openAddForm}
          >
            {showForm ? 'Отмена' : 'Добавить оборудование'}
          </button>
        </div>
      </Card>
      {showForm && (
        <Card>
          <h2>
            {editingId === null
              ? 'Новое оборудование'
              : 'Редактирование оборудования'}
          </h2>
          <div className="equipment-form">
            <Input
              placeholder="Название оборудования"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              placeholder="Инвентарный номер"
              value={number}
              onChange={e => setNumber(e.target.value)}
            />
            <Input
              placeholder="Описание"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <label>Категория</label>
            <Select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              <option value="">Выбери категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <label>Аудитория</label>
            <Select
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
            >
              <option value="">Не назначена</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.number} — {room.building}
                </option>
              ))}
            </Select>
            <label>Состояние</label>
            <Select
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {Object.entries(statuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <button
              disabled={saving}
              onClick={saveEquipment}
            >
              {saving
                ? 'Сохранение...'
                : editingId === null
                ? 'Добавить'
                : 'Сохранить изменения'}
            </button>
          </div>
        </Card>
      )}
      <Card>
        {loading && <p>Загрузка оборудования...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <>
            <div className="equipment-table-wrap">
              <table className="equipment-table">
                <thead>
                  <tr>
                    <th>Инв. номер</th>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Аудитория</th>
                    <th>Состояние</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map(item => (
                    <tr key={item.id}>
                      <td>{item.inventory_number}</td>
                      <td>{item.name}</td>
                      <td>
                        {item.equipment_categories?.name || 'Без категории'}
                      </td>
                      <td>{item.rooms?.number || 'Не назначена'}</td>
                      <td>
                        <Badge
                          variant={
                            item.status === 'available'
                              ? 'success'
                              : item.status === 'in_use'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {item.status
                            ? statuses[item.status] || item.status
                            : 'Не указан'}
                        </Badge>
                      </td>
                      <td>
                        <div className="equipment-actions">
                          <Link
                            to={`/equipment/${item.id}`}
                            className="equipment-link"
                          >
                            Подробнее
                          </Link>
                          <button onClick={() => editEquipment(item)}>
                            Изменить
                          </button>
                          <button
                            className="equipment-delete"
                            onClick={() => deleteEquipment(item.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEquipment.length === 0 && (
              <p className="equipment-empty">
                Оборудование не найдено
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  )
}