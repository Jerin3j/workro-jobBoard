import { Navbar } from '@/components/layout/Navbar'
import React, { ReactNode } from 'react'

export default function layout  ({childern}: {childern : ReactNode}) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Navbar/>
        {childern}
    </div>
  )
}
