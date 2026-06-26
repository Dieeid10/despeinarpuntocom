'use client'

import { useMemo, useState } from 'react'

type Option = {
  value: string | number
  label: string
  description?: string
}

type SearchableSelectProps = {
  label: string
  value: string | number | ''
  options: Option[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  onChange: (value: string | number) => void
}

export function SearchableSelect({
  label,
  value,
  options,
  placeholder = 'Buscar...',
  disabled = false,
  required = false,
  onChange,
}: SearchableSelectProps) {
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    const term = search.toLowerCase().trim()

    if (!term) return options

    return options.filter((option) =>
      `${option.label} ${option.description ?? ''}`
        .toLowerCase()
        .includes(term)
    )
  }, [options, search])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="text"
        value={search}
        disabled={disabled}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2 disabled:bg-gray-100"
      />

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
      >
        <option value="">Seleccionar...</option>

        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}