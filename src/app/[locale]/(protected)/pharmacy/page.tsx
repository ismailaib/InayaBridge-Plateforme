"use client"

import { getMedicamentsByTenant, Medicament } from '@/api/pharmacie/medicaments'
import { useEffect, useState } from 'react'
import AddMedicamentForm from './components/AddMedicamentForm'
import Table from './components/Table'

const Page = () => {
    const [tenantId, setTenantId] = useState<string | null>(null)
    const [medicaments, setMedicaments] = useState<Medicament[]>([])
    const [loading, setLoading] = useState(true)

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

    const fetchMedicaments = async () => {
        if (!tenantId) return
        setLoading(true)
        try {
            const { data } = await getMedicamentsByTenant(tenantId)
            setMedicaments(data || [])
        } catch (error) {
            console.error('Failed to fetch medicaments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMedicaments() }, [tenantId])

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Gestion de la Pharmacie
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ajouter, modifier ou supprimer des medicaments de votre pharmacie.
                    </p>
                </div>

                <div className="flex gap-4">
                    <AddMedicamentForm tenantId={tenantId || ''} onSuccess={fetchMedicaments} />
                </div>
            </div>
            <Table tenantId={tenantId || ''} data={medicaments} loading={loading} onRefresh={fetchMedicaments} />
        </div>
    )
}

export default Page