import { ChevronDown } from 'lucide-react'
import { SelectHTMLAttributes } from 'react'

type SelectProps = {
  label: string
  id: string
  options: string[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
} & SelectHTMLAttributes<HTMLSelectElement>

export function Select({
  label,
  id,
  options,
  placeholder = 'Select an option',
  value,
  onChange,
  required = true,
  error,
  ...props
}: SelectProps) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }
  
  return (
    <div className={`
      relative
      flex justify-between items-center
      h-21 px-6 gap-1
      border-b border-base-700
      bg-base-900
      group
      outline-base-700
      focus-within:outline-1 focus-within:outline-base-400 focus-within:z-10
      transition-colors duration-160
      `}
    >
      <div className="
        flex flex-col justify-center
        h-full
      ">
        <label htmlFor={id} 
          className="
            text-sm text-base-400 font-display uppercase
            group-focus-within:text-base-300 transition-colors duration-160
            pointer-events-none
          "
        >
          {label}
        </label>

        <select 
          id={id} 
          className={`
            absolute inset-0
            w-full h-full
            opacity-0
            cursor-pointer
          `}
          value={value}
          onChange={handleChange}
          required={required}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <div className={`
          pointer-events-none
          ${error ? 'text-red-500' : 'text-base-200 group-focus-within:text-base-100 transition-colors duration-160'}
          `}>
            {value || placeholder}
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <ChevronDown size={24} strokeWidth={1.5}
        className="text-base-400 group-focus-within:text-base-300
         transition-colors duration-160" />
    </div>
  )
}