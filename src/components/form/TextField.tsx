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
  error?: string
  min?: number
  max?: number
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
    autocomplete = "off",
    error,
    min,
    max
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
            bg-neutral-900
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
                onChange={(e) => {
                    if (type === 'number') {
                        onChange(e.target.valueAsNumber)
                    } else {
                        onChange(e.target.value)
                    }
                }}
                className={`text-lg ${error ? "text-red-500" : "text-neutral-200 focus:text-neutral-100"}
                    ${inputClasses[variant]}
                    focus:outline-1 focus:outline-offset-0 focus:outline-neutral-200`}
                required={required}
                min={min}
                max={max}
            />
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} TODO: add error message */}
        </div>
    )
}