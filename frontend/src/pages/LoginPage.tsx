//Форма работает, но пока реальную авторизацию не выполняет 

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import '../styles/auth.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log({
      email,
      password,
    })
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
            <div className="auth-chip">
              Оборудование
            </div>
            <div className="auth-chip">
              Аудитории
            </div>
            <div className="auth-chip">
              Заявки
            </div>
            <div className="auth-chip">
              История
            </div>
          </div>
        </div>
      </section>
      <section className="auth-right">
        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >
          <h1>
            Добро пожаловать
          </h1>
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
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
          >
            Войти
          </Button>
          <div className="auth-link">
            Нет аккаунта?{' '}
            <Link to="/register">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}