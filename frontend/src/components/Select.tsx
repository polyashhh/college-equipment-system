import type { SelectHTMLAttributes, ReactNode } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode
}
export function Select({ children, ...props }: SelectProps) {
  return (
    <select className="ui-select" {...props}>
      {children}
    </select>
  )
}