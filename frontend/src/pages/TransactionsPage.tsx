import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import '../styles/transactions.css'

type Equipment = {
  id: number
  name: string
  inventory_number: string
  status: string | null
  room_id: number | null
}

type Room = {
  id: number
  number: string
  building: string
}

type User = {
  id: number
  name: string
  email: string
}

type Transaction = {
  id: number
  transaction_type: string
  created_at: string | null
  equipment: {
    name: string
    inventory_number: string
  } | null
  users_equipment_transactions_user_idTousers: {
    name: string
  } | null
  users_equipment_transactions_performed_byTousers: {
    name: string
  } | null
  rooms_equipment_transactions_from_room_idTorooms: {
    number: string
  } | null
  rooms_equipment_transactions_to_room_idTorooms: {
    number: string
  } | null
}
const API = 'http://localhost:3000'

const types: Record<string, string> = {
  issue: 'Выдача',
  return: 'Возврат',
  move: 'Перемещение',
}

function getCurrentUserId(): number | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const bytes = Uint8Array.from(
      atob(base64),
      char => char.charCodeAt(0)
    )

    const data = JSON.parse(
      new TextDecoder('utf-8').decode(bytes)
    )
    if (typeof data.exp !== 'number' ||
        data.exp * 1000 <= Date.now()) {
      return null
    }
    return typeof data.userId === 'number'
      ? data.userId
      : null
  } catch {
    return null
  }
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Все')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [operationType, setOperationType] = useState('issue')
  const [equipmentId, setEquipmentId] = useState('')
  const [userId, setUserId] = useState('')
  const [toRoomId, setToRoomId] = useState('')
  const token = localStorage.getItem('token')
  const currentUserId = getCurrentUserId()
  const isAdmin =
    localStorage.getItem('role') === 'Администратор'

  const loadData = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API}/transactions`),
        fetch(`${API}/equipment`),
        fetch(`${API}/rooms`),
      ])
      if (responses.some(response => !response.ok)) {
        throw new Error('Ошибка сервера')
      }

      const [historyData, equipmentData, roomsData] =
        await Promise.all(
          responses.map(response => response.json())
        )
      setTransactions(historyData)
      setEquipment(equipmentData)
      setRooms(roomsData)
      if (isAdmin && token) {
        const usersResponse = await fetch(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!usersResponse.ok) {
          throw new Error('Не удалось получить пользователей')
        }

        const usersData: User[] = await usersResponse.json()
        setUsers(usersData)
      }
      setError('')
    } catch {
      setError('Не удалось загрузить историю перемещений')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])

  const closeForm = () => {
    setShowForm(false)
    setOperationType('issue')
    setEquipmentId('')
    setUserId('')
    setToRoomId('')
  }

  const availableEquipment = equipment.filter(item => {
    if (operationType === 'issue') {
      return item.status === 'available'
    }
    if (operationType === 'return') {
      return item.status === 'in_use'
    }
    return item.status !== 'in_use'
  })

  const selectedEquipment = equipment.find(
    item => item.id === Number(equipmentId)
  )

  const createTransaction = async () => {
    if (!equipmentId || !userId) {
      alert('Выбери оборудование и пользователя')
      return
    }
    if (currentUserId === null) {
      alert('Необходимо снова войти в систему')
      return
    }
    if (operationType !== 'issue' && !toRoomId) {
      alert('Выбери аудиторию назначения')
      return
    }
    if (
      operationType === 'move' &&
      selectedEquipment?.room_id === Number(toRoomId)
    ) {
      alert('Выбери другую аудиторию')
      return
    }
    setSaving(true)
    try {
      const response = await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipment_id: Number(equipmentId),
          user_id: Number(userId),
          performed_by: currentUserId,
          transaction_type: operationType,
          from_room_id: selectedEquipment?.room_id ?? null,
          to_room_id:
            operationType === 'issue' ? null : Number(toRoomId),
        }),
      })
      if (!response.ok) {
        throw new Error('Ошибка создания операции')
      }
      closeForm()
      await loadData()
    } catch {
      alert('Не удалось сохранить операцию')
    } finally {
      setSaving(false)
    }
  }

  const filteredTransactions = transactions.filter(item => {
    const name = item.equipment?.name || ''
    const number = item.equipment?.inventory_number || ''
    const query = search.toLowerCase()
    return (
      (name.toLowerCase().includes(query) ||
        number.toLowerCase().includes(query)) &&
      (typeFilter === 'Все' ||
        item.transaction_type === typeFilter)
    )
  })
  return (
    <div className="transactions-page">
      <header className="transactions-header">
        <h1>История перемещений</h1>
        <p>Журнал операций с оборудованием колледжа</p>
      </header>
      <Card>
        <div className="transactions-filters">
          <Input
            placeholder="Поиск по оборудованию"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="Все">Все операции</option>
            <option value="issue">Выдача</option>
            <option value="return">Возврат</option>
            <option value="move">Перемещение</option>
          </Select>
          {isAdmin && (
            <button
              className="transaction-add-button"
              onClick={() => {
                if (showForm) {
                  closeForm()
                } else {
                  setShowForm(true)
                }
              }}
            >
              {showForm ? 'Отмена' : 'Новая операция'}
            </button>
          )}
        </div>
      </Card>
      {showForm && isAdmin && (
        <Card>
          <h2>Новая операция с оборудованием</h2>
          <div className="transaction-form">
            <label>Тип операции</label>
            <Select
              value={operationType}
              onChange={e => {
                setOperationType(e.target.value)
                setEquipmentId('')
                setUserId('')
                setToRoomId('')
              }}
            >
              <option value="issue">Выдача</option>
              <option value="return">Возврат</option>
              <option value="move">Перемещение</option>
            </Select>
            <label>Оборудование</label>
            <Select
              value={equipmentId}
              onChange={e => {
                setEquipmentId(e.target.value)
                setToRoomId('')
              }}
            >
              <option value="">Выбери оборудование</option>
              {availableEquipment.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.inventory_number}
                </option>
              ))}
            </Select>
            <label>
              {operationType === 'issue'
                ? 'Кому выдаём'
                : operationType === 'return'
                ? 'Кто возвращает'
                : 'Ответственный пользователь'}
            </label>
            <Select
              value={userId}
              onChange={e => setUserId(e.target.value)}
            >
              <option value="">Выбери пользователя</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} — {user.email}
                </option>
              ))}
            </Select>
            {operationType !== 'issue' && (
              <>
                <label>Аудитория назначения</label>
                <Select
                  value={toRoomId}
                  onChange={e => setToRoomId(e.target.value)}
                >
                  <option value="">Выбери аудиторию</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.number} — {room.building}
                    </option>
                  ))}
                </Select>
              </>
            )}
            <button
              disabled={saving || availableEquipment.length === 0}
              onClick={createTransaction}
            >
              {saving ? 'Сохранение...' : 'Сохранить операцию'}
            </button>
          </div>
        </Card>
      )}
      <Card>
        {loading && <p>Загрузка истории...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <>
            <div className="transactions-table-wrap">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Оборудование</th>
                    <th>Откуда</th>
                    <th>Куда</th>
                    <th>Ответственный</th>
                    <th>Операция</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(item => (
                    <tr key={item.id}>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at)
                              .toLocaleString('ru-RU')
                          : '—'}
                      </td>
                      <td>
                        {item.equipment?.name || 'Не указано'}
                      </td>
                      <td>
                        {item.rooms_equipment_transactions_from_room_idTorooms
                          ?.number || '—'}
                      </td>
                      <td>
                        {item.rooms_equipment_transactions_to_room_idTorooms
                          ?.number || '—'}
                      </td>
                      <td>
                        {item.users_equipment_transactions_performed_byTousers
                          ?.name || 'Не указан'}
                      </td>
                      <td>
                        {types[item.transaction_type] ||
                          item.transaction_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length === 0 && (
              <p className="transactions-empty">
                Операции не найдены
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  )
}