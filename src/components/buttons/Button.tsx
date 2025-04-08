import { forwardRef, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
  variant?: 'default' | 'panelDefault' | 'topBar' | 'panelGhost' | 'panelGhostDanger'
  children?: React.ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: `
                text-base-400
                [&:hover,&:focus]:text-base-300
                [&:hover,&:focus]:bg-base-900
                [&:hover:active,&:focus:active]:bg-base-800`,
      topBar: `
                text-base-400
                [&:hover,&:focus]:text-base-300
                [&:hover,&:focus]:bg-base-900
                [&:hover:active,&:focus:active]:bg-base-800`,
      panelDefault: `
                text-base-200
                bg-base-800
                [&:hover,&:focus]:text-base-100
                [&:hover,&:focus]:bg-base-700/50
                [&:hover:active,&:focus:active]:bg-base-700`,
      panelGhost: `
                text-base-400
                [&:hover,&:focus]:text-base-300
                [&:hover,&:focus]:bg-base-800/50
                [&:hover:active,&:focus:active]:bg-base-800`,
      panelGhostDanger: `
                text-rose-700
                [&:hover,&:focus]:text-rose-600
                [&:hover,&:focus]:bg-base-800/50
                [&:hover:active,&:focus:active]:bg-base-800
                [&:focus-visible]:outline-rose-600`,
    }

    return (
      <button
        ref={ref}
        className={`
                    flex items-center justify-center
                    font-display text-sm uppercase
                    cursor-pointer
                    outline-0 outline-base-700
                    focus-visible:outline-1 focus-visible:outline-base-400 focus-visible:outline-offset-0 focus-visible:z-10
                    transition-colors duration-80
                    ${variantClasses[variant]}
                    ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
