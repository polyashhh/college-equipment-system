import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import '../styles/rooms.css'

type Room = {
  id: number
  number: string
  building: string
  description: string | null
}

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [number, setNumber] = useState('')
  const [building, setBuilding] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/rooms')
      .then(response => {
        if (!response.ok) throw new Error('Ошибка загрузки')
        return response.json()
      })
      .then((data: Room[]) => setRooms(data))
      .catch(() => setError('Не удалось загрузить аудитории'))
      .finally(() => setLoading(false))
  }, [])

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNumber('')
    setBuilding('')
    setDescription('')
  }

  const openAddForm = () => {
    closeForm()
    setShowForm(true)
  }

  const editRoom = (room: Room) => {
    setEditingId(room.id)
    setNumber(room.number)
    setBuilding(room.building)
    setDescription(room.description || '')
    setShowForm(true)
  }

  const saveRoom = async () => {
    if (!number.trim() || !building.trim()) {
      alert('Заполни номер аудитории и корпус')
      return
    }
    const isEditing = editingId !== null
    try {
      const response = await fetch(
        isEditing
          ? `http://localhost:3000/rooms/${editingId}`
          : 'http://localhost:3000/rooms',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: number.trim(),
            building: building.trim(),
            description: description.trim(),
          }),
        }
      )
      if (!response.ok) throw new Error('Ошибка сохранения')
      const savedRoom: Room = await response.json()
      if (isEditing) {
        setRooms(current =>
          current.map(room =>
            room.id === savedRoom.id ? savedRoom : room
          )
        )
      } else {
        setRooms(current => [...current, savedRoom])
      }
      closeForm()
    } catch {
      alert('Не удалось сохранить аудиторию')
    }
  }

  const deleteRoom = async (id: number) => {
    if (!window.confirm('Точно удалить аудиторию?')) return
    try {
      const response = await fetch(
        `http://localhost:3000/rooms/${id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Ошибка удаления')
      setRooms(current =>
        current.filter(room => room.id !== id)
      )
      if (editingId === id) closeForm()
    } catch {
      alert('Не удалось удалить аудиторию')
    }
  }

  const filteredRooms = rooms.filter(room => {
    const query = search.toLowerCase()
    return (
      room.number.toLowerCase().includes(query) ||
      room.building.toLowerCase().includes(query) ||
      (room.description || '').toLowerCase().includes(query)
    )
  })
  return (
    <div className="rooms-page">
      <header className="rooms-header">
        <h1>Аудитории</h1>
        <p>Информация об учебных помещениях колледжа</p>
      </header>
      <Card>
        <div className="rooms-filters">
          <Input
            placeholder="Поиск по номеру, корпусу или описанию"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={showForm ? closeForm : openAddForm}
          >
            {showForm ? 'Отмена' : 'Добавить аудиторию'}
          </button>
        </div>
      </Card>
      {showForm && (
        <Card>
          <h2>
            {editingId === null
              ? 'Новая аудитория'
              : 'Редактирование аудитории'}
          </h2>
          <div className="room-form">
            <Input
              placeholder="Номер аудитории"
              value={number}
              onChange={e => setNumber(e.target.value)}
            />
            <Input
              placeholder="Корпус"
              value={building}
              onChange={e => setBuilding(e.target.value)}
            />
            <Input
              placeholder="Описание"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <button type="button" onClick={saveRoom}>
              {editingId === null
                ? 'Добавить'
                : 'Сохранить изменения'}
            </button>
          </div>
        </Card>
      )}
      {loading && <p>Загрузка аудиторий...</p>}
      {error && <p className="rooms-empty">{error}</p>}
      {!loading && !error && (
        <>
          <div className="rooms-grid">
            {filteredRooms.map(room => (
              <Card key={room.id}>
                <div className="room-card-top">
                  <div className="room-number">
                    {room.number}
                  </div>
                  <span className="room-type">
                    {room.building}
                  </span>
                </div>
                <h2>
                  {room.description || 'Без описания'}
                </h2>
                <div className="room-actions">
                  <button
                    type="button"
                    onClick={() => editRoom(room)}
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="room-delete"
                    onClick={() => deleteRoom(room.id)}
                  >
                    Удалить
                  </button>
                </div>
              </Card>
            ))}
          </div>
          {filteredRooms.length === 0 && (
            <p className="rooms-empty">
              Аудитории не найдены
            </p>
          )}
        </>
      )}
    </div>
  )
}