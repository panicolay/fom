type TextFieldProps = {
  label: string
  id: string
  placeholder?: string
  value: string | number
  onChange: (value: string | number) => void
  type: 'text' | 'number'
  required: boolean
}

export function TextField({
    label,
    id,
    placeholder,
    value,
    onChange,
    type = 'text',
    required,
}: TextFieldProps) {
    return (
        <div className="flex items-center w-full">
            <label 
                htmlFor={id}
                className="inline-block w-32 mr-2 font-medium text-neutral-200"
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 h-8 text-neutral-200 border border-neutral-500 p-1 focus:outline-1 focus:outline-offset-2 focus:outline-neutral-300"
                required={required}
            />
        </div>
    )
}