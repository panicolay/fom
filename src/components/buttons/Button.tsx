type ButtonProps = {
  children?: React.ReactNode
  className?: string
  size?: 'small' | 'medium'
  variant?: 'primary' | 'secondary' | 'inverted' | 'ghost'
  icon?: React.ComponentType<{ className?: string, size?: number, strokeWidth?: number }>
  iconPosition?: 'left' | 'right'
  /**
   * Utilisé pour l'accessibilité lorsque le bouton ne contient qu'une icône
   * Obligatoire si children n'est pas fourni
   */
  ariaLabel?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ 
  children, 
  className = '', 
  size = 'medium', 
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  ariaLabel,
  ...props 
}: ButtonProps) {
  
  const variantClasses = {
    primary: 'bg-base-200 text-base-900',
    secondary: 'bg-base-800 text-base-200',
    inverted: 'bg-base-950 text-base-400 hover:text-base-200 border-1 border-base-700 hover:border-base-400 transition-colors duration-160',
    ghost: 'text-base-400 hover:text-base-200 transition-colors duration-160'
  }
  
  // Structure unifiée pour les tailles
  const sizes = {
    small: {
      button: {
        base: 'h-8',
        withText: 'px-3',
        iconOnly: 'w-8'
      },
      icon: { size: 16, strokeWidth: 1.5 }
    },
    medium: {
      button: {
        base: 'h-10',
        withText: 'px-4',
        iconOnly: 'w-10'
      },
      icon: { size: 18, strokeWidth: 1.5 }
    }
  }
  
  // Détermine si c'est un bouton "icon only"
  const isIconOnly = Icon && !children;
  
  // Construit les classes de taille pour le bouton
  const buttonSizeClasses = `${sizes[size].button.base} ${
    isIconOnly ? sizes[size].button.iconOnly : sizes[size].button.withText
  }`;
  
  return (
    <button 
      className={`flex items-center justify-center gap-2
        font-display text-sm uppercase
        cursor-pointer
        focus-visible:outline-1 focus-visible:outline-base-200 focus-visible:outline-offset-1
        ${buttonSizeClasses} ${variantClasses[variant]} ${className}`}
      aria-label={isIconOnly ? ariaLabel : undefined}
      {...props}
    >
      {isIconOnly ? (
        <Icon {...sizes[size].icon} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon {...sizes[size].icon} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon {...sizes[size].icon} />}
        </>
      )}
    </button>
  )
} 