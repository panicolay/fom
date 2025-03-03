type ButtonProps = {
  children?: React.ReactNode
  className?: string
  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary' | 'inverted'
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
    primary: 'bg-neutral-200 text-neutral-900',
    secondary: 'bg-neutral-700 text-neutral-300',
    inverted: 'bg-neutral-950 text-neutral-200 border-1 border-neutral-500'
  }

  const iconClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5'
  }
  
  return (
    <button 
      className={`flex items-center justify-center gap-2 px-4
        font-display lowercase
        focus:outline-1 focus:outline-neutral-200 focus:outline-offset-1
        cursor-pointer
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={iconClasses[size]} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={iconClasses[size]} />}
    </button>
  )
} 