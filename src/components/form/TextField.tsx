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
  className = '',
  autocomplete = 'off',
  error,
  min,
  max,
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const variantClasses = {
    panel: 'h-21 px-6 gap-1',
    popover: 'h-16 px-3',
  }

  return (
    <div
      className={`
                flex flex-col justify-center
                border-b border-base-700
                bg-base-900
                group
                outline-base-700
                focus-within:outline-1 focus-within:outline-base-400 focus-within:z-10
                transition-colors duration-160
                ${variantClasses[variant]}
                ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <label
        htmlFor={id}
        className={`
                    text-sm text-base-400 font-display uppercase
                    group-focus-within:text-base-300 transition-colors duration-160
                `}
      >
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
                    ${error ? 'text-red-500' : 'text-base-200 focus:text-base-100 transition-colors duration-160'}
                    `}
        required={required}
        min={min}
        max={max}
      />
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} TODO: add error message */}
    </div>
  )
}
