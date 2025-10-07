'use client'

import React, { useState, useMemo } from 'react'
import {
  RiSearchLine,
} from '@remixicon/react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cx } from '@/lib/utils'

import { Checkbox } from '@/components/Checkbox'
import { Table, TableBody, TableCell, TableFoot, TableHead, TableHeaderCell, TableRoot, TableRow } from '@/components/Table'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { DateRangePicker } from '@/components/DatePicker'
import { Label } from '@/components/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { Fullscreen, SquarePen, Trash2 } from 'lucide-react'
import DeleteDepartementModal from './DeleteDepartementModal'
import EditDepartementModal from './EditDepartementModal'

type Departement = {
  id: string
  name: string
  phone: string
  employees: number
  description: string
  status: 'active' | 'inactive'
  createdAt: string
}

const departments: Departement[] = [
  {
    id: '1',
    name: 'Radiology',
    phone: '+212 611-445566',
    employees: 8,
    description: 'Medical imaging and diagnostics',
    status: 'active',
    createdAt: '2024-10-01',
  },
  {
    id: '2',
    name: 'Pediatrics',
    phone: '+212 622-778899',
    employees: 10,
    description: 'Child healthcare and vaccination',
    status: 'active',
    createdAt: '2024-09-20',
  },
  {
    id: '3',
    name: 'Cardiology',
    phone: '+212 600-112233',
    employees: 12,
    description: 'Heart and vascular medicine',
    status: 'inactive',
    createdAt: '2024-08-14',
  },
]

const columnHelper = createColumnHelper<Departement>()

export default function TableDepartements() {
  const [rowSelection, setRowSelection] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredDepartments = useMemo(() => {
    return departments.filter((dep) => {
      const matchesSearch = dep.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || dep.status === status
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
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('employees', {
        header: 'Employees',
        meta: { align: 'text-center' },
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        meta: { align: 'text-left' },
        cell: (info) => (
          <span className="truncate text-gray-600 dark:text-gray-400">
            {info.getValue()}
          </span>
        ),
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
        header: 'Created',
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
              <EditDepartementModal />
            </button>
            <button className="p-2 hover:text-emerald-600 dark:hover:text-emerald-400">
              <Fullscreen className="size-4" />
            </button>
            <button className="p-2 hover:text-red-600 dark:hover:text-red-400">
              <DeleteDepartementModal />
            </button>
          </div>
        ),
      }),
    ],
    [],
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
                    className={cx(
                      cell.column.columnDef.meta?.align,
                      'relative',
                    )}
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
