import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/table/DashboardClient'

export default async function Dashboard() {
    const cookieStore = await cookies()
    const token = cookieStore.get('apiToken')?.value
    
    if (!token) {
      redirect('/')
    }

    return (
        <></>
    )
}
