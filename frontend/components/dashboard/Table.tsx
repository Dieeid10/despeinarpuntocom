'use client'
import React from "react"
// Navegation imports
import { useRouter } from 'next/navigation'
// Components imports
import { AccessToken } from "./AccessToken"

interface Props {
    token: string}

export const TableDashboard: React.FC<Props> = ({token}) => {

    return (
        <>
            
            <section className="w-full h-full flex justify-center items-start gap-4 p-4">
                    
            </section>
        </>
    )
}
