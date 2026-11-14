import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger'
}
export function Badge({
  children,
  variant = 'success',
}: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge-${variant}`}>
      {children}
    </span>
  )
}