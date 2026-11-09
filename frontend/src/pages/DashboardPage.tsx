import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'

export function DashboardPage() {
  return (
    <Card>
      <h1>Дашборд</h1>
      <Input placeholder="Поиск" />
      <br />
      <br />
      <Button variant="primary">
        Добавить
      </Button>
      <br />
      <br />
      <Badge variant="success">
        Доступно
      </Badge>
    </Card>
  )
}