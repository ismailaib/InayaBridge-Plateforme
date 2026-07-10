'use client'

import { cx } from '@/lib/utils'
import { RiSearchLine } from '@remixicon/react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { DateRangePicker } from '@/components/DatePicker'
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
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@/components/Table'
import EditServiceModal from './EditServiceModal'
import DeleteServiceModal from './DeleteServiceModal'
import { Service } from '@/api/services'

type Props = {
  data: Service[]
  loading?: boolean
  onRefresh?: () => void
}

const columnHelper = createColumnHelper<Service>()

export default function TableServices({ data, loading, onRefresh }: Props) {
  const [rowSelection, setRowSelection] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all')

  const filteredServices = useMemo(() => {
    return data.filter((service) => {
      const matchesSearch = service.name?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || service.status === status
      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Nom du service',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('code', {
        header: 'Code',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('departmentName', {
        header: 'Département',
        meta: { align: 'text-left' },
        cell: ({ getValue }) => getValue() || '-',
      }),
      columnHelper.accessor('price', {
        header: 'Tarif (MAD)',
        meta: { align: 'text-right' },
        cell: ({ getValue }) =>
          getValue() ? `${getValue()?.toLocaleString()} MAD` : '—',
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        meta: { align: 'text-left' },
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <span
              className={cx(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                value === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
              )}
            >
              {value === 'ACTIVE' ? 'Actif' : 'Inactif'}
            </span>
          )
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Créé le',
        meta: { align: 'text-right' },
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        meta: { align: 'text-right' },
        cell: ({ row }) => (
          <div className="inline-flex items-center space-x-1">
            <EditServiceModal service={row.original} onUpdated={onRefresh} />
            <DeleteServiceModal id={row.original.id} onDeleted={onRefresh} />
          </div>
        ),
      }),
    ],
    [onRefresh],
  )

  const table = useReactTable({
    data: filteredServices,
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
              placeholder="Rechercher un service..."
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Chargement des services...
                </TableCell>
              </TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Aucun service trouvé
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
    </Card>
  )
}
