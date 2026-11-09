import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'default' | 'primary'
}
export function Button({
  children,
  variant = 'default',
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'ui-button',
    variant === 'primary' ? 'ui-button-primary' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}