import { useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import '../styles/categories.css'

//Тестовые
const categories = [
  { id: 1, name: 'Компьютеры', count: 35, description: 'Системные блоки и моноблоки' },
  { id: 2, name: 'Ноутбуки', count: 24, description: 'Переносные компьютеры' },
  { id: 3, name: 'Проекторы', count: 16, description: 'Оборудование для презентаций' },
  { id: 4, name: 'Принтеры', count: 12, description: 'Печатающие устройства' },
  { id: 5, name: 'Мониторы', count: 28, description: 'Экраны для рабочих мест' },
  { id: 6, name: 'Периферия', count: 45, description: 'Клавиатуры, мыши и другие устройства' },
]

export function CategoriesPage() {
  const [search, setSearch] = useState('')
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="categories-page">
      <header className="categories-header">
        <h1>Категории оборудования</h1>
        <p>Список категорий техники колледжа</p>
      </header>
      <Card>
        <Input
          placeholder="Поиск категории"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Card>
      <div className="categories-grid">
        {filteredCategories.map(category => (
          <Card key={category.id}>
            <div className="category-card">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <div className="category-count">
                <span>Количество оборудования</span>
                <strong>{category.count} ед.</strong>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filteredCategories.length === 0 && (
        <p className="categories-empty">Категории не найдены</p>
      )}
    </div>
  )
}