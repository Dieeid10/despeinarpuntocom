import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { token } = await req.json()
  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
  }
  
  const payload = JSON.parse(atob(token.split('.')[1]))
  const rol = payload.rol

  const cookieStore = await cookies()
  cookieStore.set('apiToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_FORCE_HTTPS === 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 6,
  })

  const redirects: Record<string, string> = {
        'gerente':  '/dashboard',
        'operario': '/reservas',
        'finanzas': '/financiero',
    }

    const destination = redirects[rol] ?? '/dashboard'

    return NextResponse.json({ success: true, redirect: destination })
}