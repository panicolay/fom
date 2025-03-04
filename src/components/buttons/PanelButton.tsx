type Props = {
    label: string
    variant?: 'primary' | 'secondary'
    className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function PanelButton({ 
    label, 
    className = '', 
    variant = 'primary',
    ...props 
}: Props) {

    const variantClasses = {
        primary: 'bg-neutral-700',
        secondary: 'bg-neutral-900'
    }

    return (
        <button
            className={`flex items-center justify-center h-22
                font-display lowercase text-neutral-200
                focus:outline-1 focus:outline-neutral-200 focus:z-10
                cursor-pointer
                ${variantClasses[variant]} ${className}`} {...props}>
            {label}
        </button>
    )
}