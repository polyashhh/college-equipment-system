import { useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import '../styles/transactions.css'

//Тестовые
const transactions = [
  { id: 1, equipment: 'Ноутбук Lenovo', from: '101', to: '210', user: 'Иванов И.И.', date: '05.11.2026', type: 'Перемещение' },
  { id: 2, equipment: 'Проектор Epson', from: '210', to: '304', user: 'Петрова А.А.', date: '04.11.2026', type: 'Перемещение' },
  { id: 3, equipment: 'Монитор Samsung', from: 'Склад', to: '101', user: 'Сидоров П.П.', date: '03.11.2026', type: 'Выдача' },
  { id: 4, equipment: 'Принтер HP', from: '304', to: 'Склад', user: 'Кузнецова М.В.', date: '02.11.2026', type: 'Возврат' },
  { id: 5, equipment: 'Компьютер Acer', from: '312', to: '115', user: 'Смирнов Д.А.', date: '01.11.2026', type: 'Перемещение' },
]

export function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('Все')
  const filteredTransactions = transactions.filter(item =>
    item.equipment.toLowerCase().includes(search.toLowerCase()) &&
    (type === 'Все' || item.type === type)
  )
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
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="Все">Все операции</option>
            <option value="Перемещение">Перемещение</option>
            <option value="Выдача">Выдача</option>
            <option value="Возврат">Возврат</option>
          </Select>
        </div>
      </Card>
      <Card>
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
                  <td>{item.date}</td>
                  <td>{item.equipment}</td>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{item.user}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <p className="transactions-empty">Операции не найдены</p>
        )}
      </Card>
    </div>
  )
}