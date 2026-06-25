'use client'
import { useUpdateToken } from '@app/hooks/useUpdateToken'
import React from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    token: string
}

export const AccessToken: React.FC<Props> = ({ token }) => {
    const { timeToExpire, loadingDateExpire } = useUpdateToken({ token })
    const router = useRouter()
    
    return (
        <section className="w-full h-full flex justify-center items-start gap-4 p-4">
            <button 
                onClick={() => { router.push(`/config`) }}
                className={`bg-[var(--color-conteiner)] w-[25%] min-h-[260px] min-w-[110px] border rounded-md p-8 flex flex-col justify-start items-center gap-8
                        transition-transform duration-30 hover:scale-105 ${ timeToExpire?.message && timeToExpire?.message.to_expire < 10 && 'bg-red-300/60' }`}
            >
                <h2 className="text-2xl text-[var(--tipografy-subtitle)]">Tiempo para que expire el token de acceso</h2>
                <strong className="text-4xl text-[var(--tipografy-title)]">{loadingDateExpire && 'Cargando...'}{ !loadingDateExpire && (timeToExpire?.message ? timeToExpire.message.to_expire < 0 ? '0 días' : `${timeToExpire.message.to_expire} días` : 'No se pudo recuperar el tiempo de expiración.')}</strong>
                <p className="text-base text-[var(--tipografy-clear)]">{ timeToExpire?.message ? `(${timeToExpire.message.expiration_date})` : '' }</p>
            </button>
        </section>
    )
}