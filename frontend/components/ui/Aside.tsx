'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Gear, Create } from '@/icons/index'

type Rol = 'gerente' | 'operario' | 'finanzas'

const sections = [
    {
        title: 'ADMINISTRACIÓN',
        links: [
            { href: '/dashboard', label: 'Panel general', roles: ['gerente'] },
            { href: '/usuario', label: 'Usuarios y roles', roles: ['gerente'] },
            { href: '/aeropuertos', label: 'Aeropuertos', roles: ['gerente'] },
            { href: '/aerolineas', label: 'Aerolíneas', roles: ['gerente'] },
        ]
    },
    {
        title: 'OPERACIONES',
        links: [
            { href: '/reserva',  label: 'Reservas',  roles: ['gerente', 'operario'] },
            { href: '/vuelos',    label: 'Vuelos',    roles: ['gerente', 'operario'] },
            { href: '/paquete',  label: 'Paquetes',  roles: ['gerente', 'operario'] },
            { href: '/cliente',  label: 'Clientes',  roles: ['gerente', 'operario'] },
        ]
    },
    {
        title: 'FINANZAS',
        links: [
            { href: '/financiero',   label: 'Resumen financiero', roles: ['gerente', 'finanzas'] },
            { href: '/pagos',        label: 'Pagos',              roles: ['gerente', 'finanzas'] },
            { href: '/comprobantes', label: 'Comprobantes',       roles: ['gerente', 'finanzas'] },
        ]
    },
]

interface Props {
    rol: Rol
}

export const Aside = ({ rol }: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' })
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    return (
        <aside className="[grid-area:aside] flex flex-col bg-[var(--color-conteiner)] overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-md" />
                <div>
                    <p className="font-bold text-sm text-[var(--tipografy-title)]">Despeinar</p>
                    <p className="text-xs text-[var(--tipografy-clear)]">Turismo</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
                {sections.map(({ title, links }) => {
                    // filtrá los links que el rol puede ver
                    const visibleLinks = links.filter(link => link.roles.includes(rol))

                    // si no hay ningún link visible, ocultá toda la sección
                    if (visibleLinks.length === 0) return null

                    return (
                        <div key={title} className="mb-4">
                            <p className="text-xs font-semibold text-[var(--tipografy-clear)] px-3 mb-1 tracking-wider">
                                {title}
                            </p>
                            <ul>
                                {visibleLinks.map(({ href, label }) => {
                                    const isActive = pathname === href
                                    return (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium my-0.5
                                                    ${isActive
                                                        ? 'bg-[var(--color-secondary)] text-[var(--color-primary)]'
                                                        : 'text-[var(--tipografy-subtitle)] hover:bg-gray-100'
                                                    }`}
                                            >
                                                <span>{label}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-[var(--tipografy-subtitle)] hover:bg-gray-100"
                >
                    <Gear />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    )
}