import { useRef } from 'react'

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
    const inputRef = useRef<HTMLInputElement>(null)

    const labelClasses = {
        // panel: "left-6 top-4.5",
        panel: "",
        popover: "left-3 top-2"
    }

    const inputClasses = {
        // panel: "px-6 pt-10.5 pb-[calc(theme(spacing.4)_+_1px)]",
        panel:"",
        popover: "px-3 pt-9 pb-[calc(theme(spacing.2)_-_1px)]"
    }
    
    return (
        <div
            className={`
                flex flex-col justify-center
                h-21 px-6
                border-b border-base-700
                bg-base-900
                group
                outline-base-700
                focus-within:outline-1 focus-within:outline-base-400 focus-within:z-10
                transition-colors duration-160
                ${className}`}
            onClick={() => inputRef.current?.focus()}
        >
            
            <label htmlFor={id}
                className={`
                    text-sm text-base-400 font-display uppercase
                    group-focus-within:text-base-300 transition-colors duration-160
                    ${labelClasses[variant]}`}>
                {label}
            </label>
            
            <input
                ref={inputRef}
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
                className={`
                    outline-none
                    ${error ? "text-red-500" : "text-base-200 focus:text-base-100"}
                    ${inputClasses[variant]}
                    `}
                required={required}
                min={min}
                max={max}
            />
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} TODO: add error message */}
        </div>
    )
}