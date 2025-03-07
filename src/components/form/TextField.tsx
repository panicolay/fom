type TextFieldProps = {
  variant: 'panel' | 'popover'  
  label: string
  id: string
  placeholder?: string
  autocomplete?: 'off' | 'on'
  value: string | number | undefined
  onChange: (value: string | number) => void
  type: 'text' | 'number'
  required: boolean
  className?: string
}

export function TextField({
    variant = 'panel',
    label,
    id,
    placeholder,
    value,
    onChange,
    type = 'text',
    required,
    className = "",
    autocomplete = "off"
}: TextFieldProps) {

    const labelClasses = {
        panel: "left-6 top-4",
        popover: "left-3 top-2"
    }

    const inputClasses = {
        panel: "px-6 pt-11 pb-[calc(theme(spacing.4)_-_1px)]",
        popover: "px-3 pt-9 pb-[calc(theme(spacing.2)_-_1px)]"
    }
    
    return (
        <div className={`group relative flex flex-col ${className}
            border-b border-neutral-500
            bg-neutral-900 focus-within:bg-neutral-800
            `}>
            <label htmlFor={id}
                className={`absolute text-neutral-400 group-focus-within:text-neutral-300
                ${labelClasses[variant]}`}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value ?? ''}
                autoComplete={autocomplete}
                onChange={(e) => onChange(e.target.value)}
                className={`text-lg text-neutral-200
                    ${inputClasses[variant]}
                    focus:text-neutral-100
                    focus:outline-1 focus:outline-offset-0 focus:outline-neutral-200`}
                required={required}
            />
        </div>
    )
}