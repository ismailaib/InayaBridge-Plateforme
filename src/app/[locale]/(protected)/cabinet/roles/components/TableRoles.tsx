'use client'

import React, { useState, useMemo } from 'react'
import {
  RiDeleteBin7Line,
  RiPencilLine,
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
import EditRoleModal from './EditRoleModal'
import DeleteRoleModal from './DeleteRoleModal'

type Role = {
  id: string
  name: string
  description: string
  users: number
  status: 'active' | 'inactive'
  createdAt: string
}

const roles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full access to all system features and settings.',
    users: 3,
    status: 'active',
    createdAt: '2024-09-10',
  },
  {
    id: '2',
    name: 'Doctor',
    description: 'Access to patient records, appointments, and consultations.',
    users: 15,
    status: 'active',
    createdAt: '2024-09-18',
  },
  {
    id: '3',
    name: 'Nurse',
    description: 'Limited access to patient data and daily tasks.',
    users: 8,
    status: 'active',
    createdAt: '2024-09-22',
  },
  {
    id: '4',
    name: 'Receptionist',
    description: 'Manages appointments and patient check-ins.',
    users: 4,
    status: 'inactive',
    createdAt: '2024-08-27',
  },
]

const columnHelper = createColumnHelper<Role>()

export default function TableRoles() {
  const [rowSelection, setRowSelection] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = role.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || role.status === status
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
        header: 'Role Name',
        meta: { align: 'text-left' },
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        meta: { align: 'text-left' },
        cell: ({ getValue }) => (
          <span className="truncate text-gray-600 dark:text-gray-400">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('users', {
        header: 'Users',
        meta: { align: 'text-center' },
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
              <EditRoleModal />
            </button>
            <button className="p-2 hover:text-red-600 dark:hover:text-red-400">
              <DeleteRoleModal />
            </button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: filteredRoles,
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
              placeholder="Search by role name..."
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
