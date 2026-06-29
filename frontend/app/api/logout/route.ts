import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('apiToken')

    if (!token) {
      return NextResponse.json({ message: 'Not logged in' }, { status: 401 })
    }

    cookieStore.delete('apiToken')
 
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 })
  }
}