import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import '../styles/requests.css'

type Request = {
  id: number
  status: string | null
  comment: string | null
  created_at: string | null
  users: {
    name: string
    email: string
  } | null
  request_items: {
    equipment: {
      name: string
      inventory_number: string
    } | null
  }[]
}
type Equipment = {
  id: number
  name: string
  inventory_number: string
  status: string | null
}
const API = 'http://localhost:3000'

const statusNames: Record<string, string> = {
  pending: 'Ожидает',
  approved: 'Одобрена',
  rejected: 'Отклонена',
}
function getCurrentUserId(): number | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const data = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    )
    if (data.exp && data.exp * 1000 < Date.now()) {
      return null
    }
    return typeof data.userId === 'number'
      ? data.userId
      : null
  } catch {
    return null
  }
}

export function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Все')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [comment, setComment] = useState('')
  const userId = getCurrentUserId()
  const role = localStorage.getItem('role')
  const canReview =
    role === 'Администратор' || role === 'Лаборант'
  const loadData = async () => {
    try {
      const [requestsResponse, equipmentResponse] =
        await Promise.all([
          fetch(`${API}/requests`),
          fetch(`${API}/equipment`),
        ])
      if (!requestsResponse.ok || !equipmentResponse.ok) {
        throw new Error('Ошибка загрузки')
      }
      const requestsData = await requestsResponse.json()
      const equipmentData = await equipmentResponse.json()
      setRequests(requestsData)
      setEquipment(equipmentData)
      setError('')
    } catch {
      setError('Не удалось загрузить заявки')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  const toggleEquipment = (id: number) => {
    setSelectedIds(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }
  const createRequest = async () => {
    if (userId === null) {
      alert('Сначала войди в систему')
      return
    }
    if (selectedIds.length === 0) {
      alert('Выбери хотя бы одно устройство')
      return
    }
    setSaving(true)
    try {
      const response = await fetch(`${API}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          user_id: userId,
          comment: comment.trim(),
          equipment_ids: selectedIds,
        }),
      })
      if (!response.ok) throw new Error('Ошибка создания')

      setSelectedIds([])
      setComment('')
      setShowForm(false)
      await loadData()
    } catch {
      alert('Не удалось создать заявку')
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (
    id: number,
    newStatus: string
  ) => {
    let reason: string | null = null
    if (newStatus === 'rejected') {
      const answer = window.prompt('Причина отклонения')
      if (answer === null) return
      reason = answer.trim()
      if (!reason) {
        alert('Укажи причину')
        return
      }
    }
    setSaving(true)
    try {
      const response = await fetch(
        `${API}/requests/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({
            status: newStatus,
            rejection_reason: reason,
          }),
        }
      )
      if (!response.ok) throw new Error('Ошибка изменения')
      await loadData()
    } catch {
      alert('Не удалось изменить статус')
    } finally {
      setSaving(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    const names = request.request_items
      .map(item => item.equipment?.name || '')
      .join(' ')
      .toLowerCase()

    const userName = (request.users?.name || '').toLowerCase()
    const query = search.toLowerCase()
    return (
      (names.includes(query) || userName.includes(query)) &&
      (status === 'Все' || request.status === status)
    )
  })
  return (
    <div className="requests-page">
      <header className="requests-header">
        <h1>Заявки на оборудование</h1>
        <p>Просмотр и создание заявок на выдачу техники</p>
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
            <option value="pending">Ожидает</option>
            <option value="approved">Одобрена</option>
            <option value="rejected">Отклонена</option>
          </Select>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Отмена' : 'Создать заявку'}
          </button>
        </div>
      </Card>
      {showForm && (
        <Card>
          <h2>Новая заявка</h2>
          <div className="request-form">
            {userId === null && (
              <p>Для создания заявки сначала войди в систему</p>
            )}
            <p>Выбери оборудование:</p>
            {equipment
              .filter(item => item.status === 'available')
              .map(item => (
                <label key={item.id} className="request-choice">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleEquipment(item.id)}
                  />
                  {item.name} — {item.inventory_number}
                </label>
              ))}
            {!equipment.some(
              item => item.status === 'available'
            ) && (
              <p>Нет доступного оборудования</p>
            )}
            <Input
              placeholder="Комментарий к заявке"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              type="button"
              disabled={saving || userId === null}
              onClick={createRequest}
            >
              {saving ? 'Сохранение...' : 'Отправить заявку'}
            </button>
          </div>
        </Card>
      )}
      <Card>
        {loading && <p>Загрузка заявок...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <>
            <div className="requests-table-wrap">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Оборудование</th>
                    <th>Пользователь</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>
                        {request.request_items
                          .map(item => item.equipment?.name)
                          .filter(Boolean)
                          .join(', ') || 'Не указано'}
                      </td>
                      <td>{request.users?.name || 'Не указан'}</td>
                      <td>
                        {request.created_at
                          ? new Date(request.created_at)
                              .toLocaleDateString('ru-RU')
                          : 'Не указана'}
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
                      <td>
                        {request.status === 'pending' && canReview ? (
                          <div className="request-actions">
                            <button
                              disabled={saving}
                              onClick={() =>
                                updateStatus(request.id, 'approved')
                              }
                            >
                              Одобрить
                            </button>
                            <button
                              disabled={saving}
                              onClick={() =>
                                updateStatus(request.id, 'rejected')
                              }
                            >
                              Отклонить
                            </button>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <p className="requests-empty">
                Заявки не найдены
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  )
}