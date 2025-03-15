type Props = {
    label: string
    variant?: 'primary' | 'secondary'
    className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

// TODO: add a variant for the button that is used in the popover (smalle)
export function PanelButton({ 
    label, 
    className = '', 
    variant = 'primary',
    ...props 
}: Props) {

    const variantClasses = {
        primary: 'bg-base-700',
        secondary: 'bg-base-900'
    }

    return (
        <button
            className={`flex items-center justify-center h-22
                font-display lowercase text-base-200
                focus:outline-1 focus:outline-base-200 focus:z-10
                cursor-pointer
                ${variantClasses[variant]} ${className}`} {...props}>
            {label}
        </button>
    )
}