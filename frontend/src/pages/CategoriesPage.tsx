import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import '../styles/categories.css'

type Category = {
  id: number
  name: string
  description: string | null
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(response => {
        if (!response.ok) throw new Error('Ошибка загрузки')
        return response.json()
      })
      .then((data: Category[]) => setCategories(data))
      .catch(() => setError('Не удалось загрузить категории'))
      .finally(() => setLoading(false))
  }, [])

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setDescription('')
  }

  const openAddForm = () => {
    closeForm()
    setShowForm(true)
  }

  const editCategory = (category: Category) => {
    setEditingId(category.id)
    setName(category.name)
    setDescription(category.description || '')
    setShowForm(true)
  }

  const saveCategory = async () => {
    if (!name.trim()) {
      alert('Укажи название категории')
      return
    }

    const isEditing = editingId !== null
    setSaving(true)
    try {
      const response = await fetch(
        isEditing
          ? `http://localhost:3000/categories/${editingId}`
          : 'http://localhost:3000/categories',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        }
      )
      if (!response.ok) throw new Error('Ошибка сохранения')
      const savedCategory: Category = await response.json()
      if (isEditing) {
        setCategories(current =>
          current.map(category =>
            category.id === savedCategory.id
              ? savedCategory
              : category
          )
        )
      } else {
        setCategories(current => [...current, savedCategory])
      }
      closeForm()
    } catch {
      alert('Не удалось сохранить категорию')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Точно удалить категорию?')) return
    try {
      const response = await fetch(
        `http://localhost:3000/categories/${id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Ошибка удаления')
      setCategories(current =>
        current.filter(category => category.id !== id)
      )
      if (editingId === id) closeForm()
    } catch {
      alert(
        'Не удалось удалить категорию. Возможно, к ней привязано оборудование'
      )
    }
  }

  const filteredCategories = categories.filter(category => {
    const query = search.toLowerCase()
    return (
      category.name.toLowerCase().includes(query) ||
      (category.description || '').toLowerCase().includes(query)
    )
  })
  return (
    <div className="categories-page">
      <header className="categories-header">
        <h1>Категории оборудования</h1>
        <p>Список категорий техники колледжа</p>
      </header>
      <Card>
        <div className="categories-toolbar">
          <Input
            placeholder="Поиск категории"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={showForm ? closeForm : openAddForm}
          >
            {showForm ? 'Отмена' : 'Добавить категорию'}
          </button>
        </div>
      </Card>
      {showForm && (
        <Card>
          <h2>
            {editingId === null
              ? 'Новая категория'
              : 'Редактирование категории'}
          </h2>
          <div className="category-form">
            <Input
              placeholder="Название категории"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              placeholder="Описание"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <button
              type="button"
              disabled={saving}
              onClick={saveCategory}
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
      {loading && <p>Загрузка категорий...</p>}
      {error && <p className="categories-empty">{error}</p>}
      {!loading && !error && (
        <>
          <div className="categories-grid">
            {filteredCategories.map(category => (
              <Card key={category.id}>
                <div className="category-card">
                  <h2>{category.name}</h2>
                  <p>{category.description || 'Без описания'}</p>
                  <div className="category-actions">
                    <button
                      type="button"
                      onClick={() => editCategory(category)}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="category-delete"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <p className="categories-empty">
              Категории не найдены
            </p>
          )}
        </>
      )}
    </div>
  )
}