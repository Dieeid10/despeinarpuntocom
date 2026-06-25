import { TableDashboard } from "@components/dashboard/Table"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const cookieStore = await cookies()
    const token = cookieStore.get('apiToken')?.value
    
    if (!token) {
      redirect('/')
    }

    return (
        <>
            <TableDashboard token={token} />
        </>
    )
}
