import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import '../styles/auth.css'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    console.log({
      name,
      email,
      password,
      confirmPassword,
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
            ВСЁ
            <br />
            ПОД КОНТРОЛЕМ
          </h1>
          <p className="auth-description">
            Создайте аккаунт для работы с
            оборудованием, аудиториями и заявками
            колледжа
          </p>
          <div className="auth-chips">
            <div className="auth-chip">
              Быстро
            </div>
            <div className="auth-chip">
              Удобно
            </div>
            <div className="auth-chip">
              Безопасно
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
            Регистрация
          </h1>
          <p className="auth-card-description">
            Создайте новый аккаунт для входа
            в систему.
          </p>
          <div className="auth-field">
            <label htmlFor="name">
              Имя
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </div>
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
          <div className="auth-field">
            <label htmlFor="confirmPassword">
              Повторите пароль
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
          >
            Зарегистрироваться
          </Button>
          <div className="auth-link">
            Уже есть аккаунт?{' '}
            <Link to="/login">
              Войти
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}