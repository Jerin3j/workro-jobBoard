import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { ThemeToggle } from './ButtonToggle'
import { auth, signOut } from '@/app/utils/auth'
import { redirect } from 'next/navigation'

export const Navbar = async() => {

  const session = await auth();


  return (
    <nav className="flex items-center justify-between py-5">
        <Link href={''} className='flex items-center'>
        <Image src={'/logo.png'} width={40} height={40} alt=''/>
        <h1 className="text-2xl font-bold">
            Workro
            <span className='text-primary'>!</span>
        </h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle/>
       {session?.user ?
       <form action={async () =>{
        "use server"
        await signOut({redirectTo: '/'})
       }}>
        <Button>Logout</Button>
       </form>
       :
       <form action={async ()=> {
        "use server"
        redirect('/login')
       }}>
        <Button variant={'outline'}>Login</Button>
       </form>
       }

        </div>
    </nav>
  )
}
