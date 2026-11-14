import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import '../styles/auth.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка входа')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось войти'
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-mark" />
          <span>College Equipment</span>
        </div>
        <div className="auth-hero">
          <div className="auth-eyebrow">
            College Equipment System
          </div>
          <h1 className="auth-title">
            УЧЁТ
            <br />
            БЕЗ ХАОСА
          </h1>
          <p className="auth-description">
            Единая система для учёта оборудования,
            аудиторий, выдачи техники и просмотра
            истории перемещений
          </p>
          <div className="auth-chips">
            <div className="auth-chip">Оборудование</div>
            <div className="auth-chip">Аудитории</div>
            <div className="auth-chip">Заявки</div>
            <div className="auth-chip">История</div>
          </div>
        </div>
      </section>
      <section className="auth-right">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Добро пожаловать</h1>
          <p className="auth-card-description">
            Войдите в систему, используя свою
            электронную почту и пароль
          </p>
          <div className="auth-field">
            <label htmlFor="email">
              Электронная почта
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@college.ru"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Пароль</label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Выполняется вход...' : 'Войти'}
          </Button>
          <div className="auth-link">
            Нет аккаунта?{' '}
            <Link to="/register">Зарегистрироваться</Link>
          </div>
        </form>
      </section>
    </main>
  )
}