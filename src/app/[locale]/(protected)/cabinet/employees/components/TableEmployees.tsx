'use client'

import { resendEmployeeInvite, deleteEmployee } from '@/api/employees'
import { Input } from '@/components/Input'
import { Label } from '@/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@/components/Table'
import { cx } from '@/lib/utils'
import { RiSearchLine } from '@remixicon/react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import EditEmployeeModal from './EditEmployeeModal'
import DeleteEmployeeModal from './DeleteEmployeeModal'
import { showToast } from '../../../dashboard/hooks/utils'

type Employee = {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  roleName: string | null
  status: string
  type: 'EMPLOYEE' | 'INVITATION'
  joinedAt: string
}

const columnHelper = createColumnHelper<Employee>()

interface Props {
  employees: Employee[]
  loading: boolean
  refresh: () => void
  tenantId: string
}

export default function TableEmployees({
  employees,
  loading,
  refresh,
  tenantId,
}: Props) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'ACTIVE' | 'PENDING' | 'DECLINED'>('all')

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.toLowerCase()
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        (emp.email ?? '').toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || emp.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status, employees])

  const columns = useMemo(
    () => [
      columnHelper.accessor('email', {
        header: 'Email',
      }),
      columnHelper.accessor('firstName', {
        header: 'Prénom',
      }),
      columnHelper.accessor('lastName', {
        header: 'Nom',
      }),
      columnHelper.accessor('roleName', {
        header: 'Rôle',
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        cell: ({ getValue }) => {
          const value = getValue()
          const colors =
            value === 'ACTIVE'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : value === 'DECLINED'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          return (
            <span
              className={cx(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                colors
              )}
            >
              {value}
            </span>
          )
        },
      }),
      columnHelper.accessor('joinedAt', {
        header: 'Date',
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString() : '-',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const item = row.original

          // INVITATION – PENDING
          if (item.type === 'INVITATION' && item.status === 'PENDING') {
            return (
              <div className="inline-flex items-center space-x-2">
                <button
                  onClick={async () => {
                    try {
                      await resendEmployeeInvite(item.id, tenantId)
                      showToast('success', 'Invitation renvoyée', 'Email envoyé à nouveau.')
                      refresh()
                    } catch (err: any) {
                      const msg =
                        err.response?.data?.message ||
                        'Erreur lors de l’envoi de l’invitation.'
                      showToast('error', 'Échec', msg)
                    }
                  }}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Renvoyer
                </button>
                <DeleteEmployeeModal
                  employee={item}
                  tenantId={tenantId}
                  onSuccess={async () => {
                    try {
                      showToast('success', 'Invitation supprimée', 'Invitation annulée.')
                      refresh()
                    } catch (err: any) {
                      showToast('error', 'Erreur', 'Impossible de supprimer cette invitation.')
                    }
                  }}
                />
              </div>
            )
          }

          // EMPLOYEE – ACTIVE
          if (item.type === 'EMPLOYEE' && item.status === 'ACTIVE') {
            return (
              <div className="inline-flex items-center space-x-2">
                <EditEmployeeModal employee={item} onSuccess={refresh} tenantId={tenantId} />
                <DeleteEmployeeModal
                  employee={item}
                  tenantId={tenantId}
                  onSuccess={async () => {
                    try {
                      await deleteEmployee(item.id, tenantId)
                      showToast('success', 'Employé supprimé', 'Compte supprimé avec succès.')
                      refresh()
                    } catch (err: any) {
                      showToast('error', 'Erreur', 'Impossible de supprimer cet employé.')
                    }
                  }}
                />
              </div>
            )
          }

          // Default fallback
          return <span className="text-gray-400 text-sm">—</span>
        },
      }),
    ],
    [refresh, tenantId]
  )

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Rechercher</Label>
          <div className="relative mt-2">
            <RiSearchLine className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <Input
              placeholder="Chercher par nom ou email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Statut</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Choisir statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="ACTIVE">Actif</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="DECLINED">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <TableRoot>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHeaderCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Aucun employé trouvé
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  )
}
