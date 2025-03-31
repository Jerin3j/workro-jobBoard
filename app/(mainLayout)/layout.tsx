import { Navbar } from '@/components/layouts/Navbar'
import React from 'react'

export default function layout  ({children}: {children : React.ReactNode}) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8 md:pb-12">
        <Navbar/>
        {children}
    </div>
  )
}
