import { Header } from "@/components/ui/Header"
import { Aside } from "@/components/ui/Aside"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import './layout.css'

export default async function Layout({ children }: { children: React.ReactNode }) {
   const cookieStore = await cookies()
    const token = cookieStore.get('apiToken')?.value

    if (!token) {
        redirect('/')
        return null
    }

    const payload = JSON.parse(atob(token.split('.')[1]))
    const rol = payload.rol
    return (
        <div className="containerAll">
            <Aside rol={rol} />
            <main className="[grid-area:main]">{children}</main>
        </div>
    )
}