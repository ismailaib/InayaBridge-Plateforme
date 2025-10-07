'use client'

import { cx } from '@/lib/utils'
import {
  RiSearchLine
} from '@remixicon/react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { Table, TableBody, TableCell, TableFoot, TableHead, TableHeaderCell, TableRoot, TableRow } from '@/components/Table'
import EditServiceModal from './EditServiceModal'
import DeleteServiceModal from './DeleteServiceModal'

type Service = {
  id: string
  name: string
  department: string
  duration: number
  price: number
  status: 'active' | 'inactive'
  createdAt: string
}

const services: Service[] = [
  {
    id: '1',
    name: 'Echography',
    department: 'Radiology',
    duration: 30,
    price: 350,
    status: 'active',
    createdAt: '2024-09-28',
  },
  {
    id: '2',
    name: 'MRI Scan',
    department: 'Radiology',
    duration: 60,
    price: 800,
    status: 'active',
    createdAt: '2024-09-15',
  },
  {
    id: '3',
    name: 'Pediatric Consultation',
    department: 'Pediatrics',
    duration: 20,
    price: 250,
    status: 'inactive',
    createdAt: '2024-08-30',
  },
  {
    id: '4',
    name: 'Cardiac Check-up',
    department: 'Cardiology',
    duration: 45,
    price: 500,
    status: 'active',
    createdAt: '2024-08-18',
  },
]

const columnHelper = createColumnHelper<Service>()

export default function TableServices() {
  const [rowSelection, setRowSelection] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || service.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={() => table.toggleAllPageRowsSelected()}
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={() => row.toggleSelected()}
            className="translate-y-0.5"
          />
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Service Name',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('duration', {
        header: 'Duration (min)',
        meta: { align: 'text-center' },
        cell: ({ getValue }) => `${getValue()} min`,
      }),
      columnHelper.accessor('price', {
        header: 'Price (MAD)',
        meta: { align: 'text-right' },
        cell: ({ getValue }) => `${getValue().toLocaleString()} MAD`,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        meta: { align: 'text-left' },
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <span
              className={cx(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                value === 'active'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
              )}
            >
              {value}
            </span>
          )
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        meta: { align: 'text-right' },
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        meta: { align: 'text-right' },
        cell: () => (
          <div className="inline-flex items-center space-x-1">
            <button className="p-2 hover:text-blue-600 dark:hover:text-blue-400">
              <EditServiceModal />
            </button>
            <button className="p-2 hover:text-red-600 dark:hover:text-red-400">
              <DeleteServiceModal />            
            </button>
          </div>
        ),
      }),
    ],
    [],
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
          <Label htmlFor="search">Search</Label>
          <div className="relative mt-2">
            <RiSearchLine className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Created between</Label>
          <DateRangePicker
            defaultValue={{
              from: new Date(new Date().setDate(new Date().getDate() - 30)),
              to: new Date(),
            }}
            className="mt-2"
          />
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => row.toggleSelected(!row.getIsSelected())}
                className={cx(
                  'group select-none hover:bg-gray-50 hover:dark:bg-gray-900 transition',
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

          <TableFoot>
            <TableRow>
              <TableHeaderCell colSpan={1} className="border-transparent">
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected()
                      ? true
                      : table.getIsSomePageRowsSelected()
                        ? 'indeterminate'
                        : false
                  }
                  onCheckedChange={() => table.toggleAllPageRowsSelected()}
                />
              </TableHeaderCell>
              <TableHeaderCell colSpan={7} className="border-transparent font-normal">
                {Object.keys(rowSelection).length} of {table.getRowModel().rows.length} selected
              </TableHeaderCell>
            </TableRow>
          </TableFoot>
        </Table>
      </TableRoot>
    </Card>
  )
}
