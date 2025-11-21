"use client"

import React, { useEffect, useState } from 'react'
import Table from './components/Table'
import AddCategoryDialog from './components/AddCategoryDialog'

const Page = () => {
    const [tenantId, setTenantId] = useState<string | null>(null)
    const [categories, setCategories] = useState([])
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        try {
            const stored = localStorage.getItem('user')
            if (stored) {
                const parsed = JSON.parse(stored)
                setTenantId(parsed?.doctorProfile?.tenantId ?? null)
            }
        } catch (e) {
            console.error(e)
        }
    }, [])

    const refetchCategories = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Gestion des Categories
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ajouter, modifier ou supprimer des categories de votre pharmacie.
                    </p>
                </div>

                <div className="flex gap-4">
                    <AddCategoryDialog tenantId={tenantId ? tenantId : ''} onCategoryAdded={refetchCategories}/>
                </div>
            </div>
            <Table
                tenantId={tenantId ? tenantId : ''}
                refreshTrigger={refreshTrigger}
                onRefetch={refetchCategories}
            />
        </div>
    )
}

export default Page