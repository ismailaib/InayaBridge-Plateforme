'use client'

import React, { useState, useMemo } from 'react'
import { RiSearchLine } from '@remixicon/react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cx } from '@/lib/utils'
import { Checkbox } from '@/components/Checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@/components/Table'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { DateRangePicker } from '@/components/DatePicker'
import { Label } from '@/components/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { Fullscreen } from 'lucide-react'
import DeleteDepartementModal from './DeleteDepartementModal'
import EditDepartementModal from './EditDepartementModal'

type Departement = {
  id: string
  name: string
  phone?: string
  employees?: number
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
  createdAt: string
}

const columnHelper = createColumnHelper<Departement>()

interface TableDepartementsProps {
  data: Departement[]
  loading?: boolean
  onRefresh?: () => void
}

export default function TableDepartements({
  data,
  loading,
  onRefresh,
}: TableDepartementsProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all')

  // 🔍 Filtered data
  const filteredDepartments = useMemo(() => {
    return data.filter((dep) => {
      const matchesSearch = dep.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || dep.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status, data])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Nom',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('phone', {
        header: 'Téléphone',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('employees', {
        header: 'Employés',
        meta: { align: 'text-center' },
        cell: ({ getValue }) => getValue() ?? 0,
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        meta: { align: 'text-left' },
        cell: (info) => (
          <span className="truncate text-gray-600 dark:text-gray-400">
            {info.getValue() || '—'}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        meta: { align: 'text-left' },
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <span
              className={cx(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                value === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
              )}
            >
              {value ?? '—'}
            </span>
          )
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Créé le',
        meta: { align: 'text-right' },
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        meta: { align: 'text-right' },
        cell: ({ row }) => (
          <div className="inline-flex items-center space-x-1">
            <EditDepartementModal departement={row.original} onUpdated={onRefresh} />
            <button className="p-2 hover:text-emerald-600 dark:hover:text-emerald-400">
              <Fullscreen className="size-4" />
            </button>
            <DeleteDepartementModal id={row.original.id} onDeleted={onRefresh} />
          </div>
        ),
      }),
    ],
    [onRefresh],
  )

  const table = useReactTable({
    data: filteredDepartments,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { rowSelection },
  })

  return (
    <Card className="p-6 space-y-6">
      {/* ---------------- Filter Bar ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
        <div>
          <Label htmlFor="search">Recherche</Label>
          <div className="relative mt-2">
            <RiSearchLine className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Rechercher par nom..."
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
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="ACTIVE">Actif</SelectItem>
              <SelectItem value="INACTIVE">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------------- Table ---------------- */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          Chargement des départements...
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          Aucun département trouvé.
        </div>
      ) : (
        <TableRoot>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHeaderCell
                      key={header.id}
                      className={cx(header.column.columnDef.meta?.align)}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => row.toggleSelected(!row.getIsSelected())}
                  className={cx(
                    'group cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-900 transition',
                    row.getIsSelected() ? 'bg-gray-50 dark:bg-gray-900' : '',
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cx(cell.column.columnDef.meta?.align, 'relative')}
                    >
                      {index === 0 && row.getIsSelected() && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-500 dark:bg-blue-500" />
                      )}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      )}
    </Card>
  )
}
