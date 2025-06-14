"use client"

import { SidebarTrigger } from '@/components/Sidebar'
import React from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { usePathname } from 'next/navigation'

const Header = () => {

    const pathname = usePathname()
    if (pathname.startsWith('/ai')) return null

    return (
        <div>
            <header className=" sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
                <SidebarTrigger className="-ml-1" />
                <div className="mr-2 h-4 w-px bg-gray-200 dark:bg-gray-800" />
                <Breadcrumbs />
            </header>
        </div>
    )
}

export default Header