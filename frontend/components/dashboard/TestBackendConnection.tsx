'use client'

import { useState } from 'react'
import { env } from '@app/config/env'

interface TestBackendConnectionProps {
    token: string
}

export function TestBackendConnection({ token }: TestBackendConnectionProps) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string>('')
    const [error, setError] = useState<string>('')

    // Función para probar el health check del backend
    const testHealthCheck = async () => {
        setLoading(true)
        setError('')
        setResult('')
        
        try {
            // URL del backend - ajusta según tu configuración
            const backendUrl = env.BASE_API_URL || 'localhost:8000'
            const response = await fetch(`http://${backendUrl}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.text()
                setResult(`✅ Conexión exitosa: ${data}`)
            } else {
                setError(`❌ Error ${response.status}: ${response.statusText}`)
            }
        } catch (err) {
            setError(`❌ Error de conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`)
        } finally {
            setLoading(false)
        }
    }

    // Función para probar un endpoint protegido
    const testProtectedEndpoint = async () => {
        setLoading(true)
        setError('')
        setResult('')
        
        try {
            const backendUrl = env.BASE_API_URL || 'localhost:8000'
            const response = await fetch(`http://${backendUrl}/facebook/connection`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setResult(`✅ Endpoint protegido exitoso: ${JSON.stringify(data, null, 2)}`)
            } else {
                setError(`❌ Error ${response.status}: ${response.statusText}`)
            }
        } catch (err) {
            setError(`❌ Error de conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`)
        } finally {
            setLoading(false)
        }
    }

    // Función para probar con una URL personalizada
    const testCustomUrl = async () => {
        setLoading(true)
        setError('')
        setResult('')
        
        try {
            // Ejemplo: probar con una URL específica de otro contenedor
            const customUrl = prompt('Ingresa la URL del contenedor a probar (ej: localhost:8000/facebook/campaigns)')
            
            if (!customUrl) return
            
            const response = await fetch(`http://${customUrl}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setResult(`✅ URL personalizada exitosa: ${JSON.stringify(data, null, 2)}`)
            } else {
                setError(`❌ Error ${response.status}: ${response.statusText}`)
            }
        } catch (err) {
            setError(`❌ Error de conexión: ${err instanceof Error ? err.message : 'Error desconocido'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">🧪 Pruebas de Conexión al Backend</h3>
            
            <div className="space-y-3">
                <div className="flex gap-2">
                    <button
                        onClick={testHealthCheck}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Probando...' : 'Test Health Check'}
                    </button>
                    
                    <button
                        onClick={testProtectedEndpoint}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? 'Probando...' : 'Test Endpoint Protegido'}
                    </button>
                    
                    <button
                        onClick={testCustomUrl}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        {loading ? 'Probando...' : 'Test URL Personalizada'}
                    </button>
                </div>

                {result && (
                    <div className="p-3 bg-green-100 border border-green-400 rounded">
                        <pre className="text-sm text-green-800 whitespace-pre-wrap">{result}</pre>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 rounded">
                        <pre className="text-sm text-red-800 whitespace-pre-wrap">{error}</pre>
                    </div>
                )}

                <div className="text-sm text-gray-600">
                    <p><strong>URL Base configurada:</strong> {env.BASE_API_URL || 'No configurada'}</p>
                    <p><strong>Token disponible:</strong> {token ? '✅ Sí' : '❌ No'}</p>
                </div>
            </div>
        </div>
    )
} 