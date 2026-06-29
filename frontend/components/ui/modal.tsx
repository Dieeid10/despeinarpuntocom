'use client'

import { useState } from 'react'

interface Field {
    key: string
    label: string
    type?: any
    options?: { value: string, label: string }[]
    required?: boolean
}

interface ModalFormProps<T extends Record<string, any>> {
  title: string
  fields: Field[]
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<any>
  onClose: () => void
}

export const ModalForm = <T extends Record<string, any>>({
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
}: ModalFormProps<T>) => {
    const [formData, setFormData] = useState<Record<string, any>>(
        initialData ?? Object.fromEntries(fields.map(f => [f.key, '']))
    )
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState<string | null>(null)

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await onSubmit(formData as T)

            if (result?.success === false) {
            setError(result.message)
            return
            }

            onClose()
        } catch (error: any) {
            setError(error?.message ?? 'Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
                </div>

                <div className="px-6 py-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    {fields.map(field => (
                        <div key={field.key} className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    value={formData[field.key] ?? ''}
                                    onChange={e => handleChange(field.key, e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar...</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type ?? 'text'}
                                    value={formData[field.key] ?? ''}
                                    onChange={e => handleChange(field.key, e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    )
}