type TextFieldProps = {
  label: string
  id: string
  placeholder?: string
  value: string | number
  onChange: (value: string | number) => void
  type: 'text' | 'number'
  required: boolean
  className?: string
}

export function TextField({
    label,
    id,
    placeholder,
    value,
    onChange,
    type = 'text',
    required,
    className = ""
}: TextFieldProps) {
    return (
        <div className={`group relative flex flex-col ${className}`}>
            <label 
                htmlFor={id}
                className="absolute
                    left-6 top-4
                    text-neutral-400
                    group-focus-within:text-neutral-300"
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-lg text-neutral-200
                    px-6 pt-11 pb-[calc(theme(spacing.4)_-_1px)]
                    border-b border-neutral-500
                    focus:text-neutral-100 focus:bg-neutral-800 focus:outline-1 focus:outline-neutral-200"
                required={required}
            />
        </div>
    )
}