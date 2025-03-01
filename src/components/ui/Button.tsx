type ButtonProps = {
  children?: React.ReactNode
  className?: string
  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary'
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: 'left' | 'right'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ 
  children, 
  className = '', 
  size = 'medium', 
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  ...props 
}: ButtonProps) {
  
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
  }

  const variantClasses = {
    primary: 'bg-neutral-300 text-neutral-950',
    secondary: 'bg-neutral-600 text-neutral-200'
  }

  const iconClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5'
  }
  
  return (
    <button 
      className={`flex items-center justify-center gap-2 px-4
        font-display font-medium uppercase text-lg
        focus:outline-1 focus:outline-neutral-200 focus:outline-offset-1
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={iconClasses[size]} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={iconClasses[size]} />}
    </button>
  )
} 