import { Navbar } from '@/components/layouts/Navbar'
import React from 'react'
import { auth } from '../utils/auth';
import { prisma } from '../utils/db';
import { redirect } from 'next/navigation';

export default async function layout  ({children}: {children : React.ReactNode}) {
  const session = await auth();

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onBoardingCompleted: true },
    });

    if (user && !user.onBoardingCompleted) {
      redirect("/onboarding");
    }
  }

  return (
    <div className="w-full md:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8 md:pb-12">
        <Navbar/>
        {children}
    </div>
  )
}
