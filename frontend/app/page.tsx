import { Form } from "@components/login/Form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('apiToken')?.value
  
  if (token) {
    redirect('/dashboard')
  }
  
  return (
    <main className="w-full h-full flex justify-center items-center rounded-xl">
      <Form />
    </main>
  );
}
