type ButtonProps = {
    children?: React.ReactNode
    className?: string
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
    action: (e: React.MouseEvent) => void
    size?: number
    strokeWidth?: number
} & React.ButtonHTMLAttributes<HTMLButtonElement>
  
export function TableButton({ 
  className = '', 
  icon: Icon,
  action,
  size = 18,
  strokeWidth = 1.75,
  children,
  ...props 
}: ButtonProps) {
    
  return (
    <button 
      className={`flex items-center justify-center p-2
        text-base-500
        hover:text-base-200  
        focus:outline-1 focus:outline-base-200 focus:text-base-200
        cursor-pointer
        ${className}`}
      {...props}
      onClick={action}
    >
      {Icon && <Icon className="" size={size} strokeWidth={strokeWidth} />}
      {children}
    </button>
  )
} 