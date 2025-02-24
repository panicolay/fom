type ButtonProps = {
  children: React.ReactNode
  className?: string
  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ 
  children, 
  className = '', 
  size = 'medium', 
  variant = 'primary',
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
  
  return (
    <button 
      className={`flex items-center justify-center font-medium px-4 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 