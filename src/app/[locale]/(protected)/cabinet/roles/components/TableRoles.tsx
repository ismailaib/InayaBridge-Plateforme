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
import EditRoleModal from './EditRoleModal'
import DeleteRoleModal from './DeleteRoleModal'
import type { Role } from '@/api/roles'

interface TableRolesProps {
  roles: Role[]
  loading?: boolean
  onRefresh?: () => void
  tenantId: string
}

const columnHelper = createColumnHelper<Role>()

export default function TableRoles({
  roles,
  loading,
  onRefresh,
}: TableRolesProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = role.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        status === 'all' || role.status.toLowerCase() === status
      return matchesSearch && matchesStatus
    })
  }, [roles, search, status])

  const columns = useMemo(
    () => [
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
      columnHelper.accessor('status', {
        header: 'Status',
        meta: { align: 'text-left' },
        cell: ({ getValue }) => {
          const value = getValue()?.toLowerCase()
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
        cell: ({ row }) => {
          const role = row.original
          const isProtected = role.permissions?.includes('*')

          return (
            <div className="inline-flex items-center space-x-1 justify-end">
              {isProtected ? (
                <span className="text-xs text-gray-400 italic">Protected</span>
              ) : (
                <>
                  <button className="p-2 hover:text-blue-600 dark:hover:text-blue-400">
                    <EditRoleModal role={role} onRoleUpdated={onRefresh} />
                  </button>
                  <button className="p-2 hover:text-red-600 dark:hover:text-red-400">
                    <DeleteRoleModal roleId={role.id} onRoleDeleted={onRefresh} />
                  </button>
                </>
              )}
            </div>
          )
        },
      }),
    ],
    [onRefresh],
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
      </div>

      {/* ---------------- Table ---------------- */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Loading roles...
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          No roles found.
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
