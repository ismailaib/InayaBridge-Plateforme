"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import { cx } from "@/lib/utils";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import {
  RowData,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import React, { useEffect, useState, useMemo } from "react";
import { TenantPatient, getPatientsByTenant } from "@/api/patients";
import Edit from "./Edit"; 
import Delete from "./Delete";
import { FolderSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align: string;
  }
}

interface TableProps {
  refreshKey: number;
  filters?: {
    search?: string;
    dobRange?: { from: Date; to: Date };
    gender?: "all" | "male" | "female";
    sort?: "asc" | "desc";
  };
}

// Pagination Button Components
const TextButton = ({ onClick, disabled, children, className = "" }: any) => {
  return (
    <button
      type="button"
      className={cx(
        "group rounded-sm p-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const NumberButton = ({ active, onClick, children }: any) => {
  return (
    <button
      type="button"
      className={cx(
        "min-w-[30px] border-b-2 p-2 text-sm",
        active
          ? "border-blue-600 font-semibold"
          : "border-transparent hover:border-gray-300"
      )}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
};

const MobileButton = ({ onClick, disabled, children }: any) => {
  return (
    <button
      type="button"
      className="group px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function PatientsTable({ refreshKey, filters }: TableProps) {
  const pageSize = 8;
  const [patients, setPatients] = useState<TenantPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter
  // Load tenantId from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setTenantId(user?.doctorProfile?.tenantId || user?.tenantId);
    }
  }, []);

  // Fetch patients - now includes refreshKey in dependencies
  useEffect(() => {
    if (!tenantId) return;

    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await getPatientsByTenant(tenantId);
        setPatients(res.data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [refreshKey, tenantId]);

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    if (!patients) return [];

    let filtered = [...patients];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter((patient) => {
        const searchableFields = [
          patient.firstName,
          patient.lastName,
          patient.email,
          patient.phone,
          patient.cin,
        ].map((field) => (field || "").toLowerCase());

        return searchableFields.some((field) => field.includes(searchLower));
      });
    }

    // Apply gender filter
    if (filters?.gender && filters.gender !== "all") {
      filtered = filtered.filter((patient) => {
        const patientGender = patient.gender?.toLowerCase();
        return patientGender === filters.gender;
      });
    }

    // Apply date of birth range filter
    if (filters?.dobRange?.from && filters?.dobRange?.to) {
      filtered = filtered.filter((patient) => {
        if (!patient.dateOfBirth || !filters.dobRange) return false;
        const patientDob = new Date(patient.dateOfBirth);
        return (
          patientDob >= filters.dobRange.from &&
          patientDob <= filters.dobRange.to
        );
      });
    }

    // Apply sort by last visit
    if (filters?.sort) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

        return filters.sort === "desc" ? dateB - dateA : dateA - dateB;
      });
    }

    return filtered;
  }, [patients, filters]);

  // Refresh handler for Edit/Delete success
  const handleRefresh = async () => {
    if (!tenantId) return;
    const res = await getPatientsByTenant(tenantId);
    setPatients(res.data);
  };

  const columns = [
    { header: "Nom", accessorKey: "lastName", meta: { align: "text-left" } },
    { header: "Prénom", accessorKey: "firstName", meta: { align: "text-left" } },
    {
      header: "Genre",
      accessorKey: "gender",
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue()?.toLowerCase();
        if (value === "male") return "Homme";
        if (value === "female") return "Femme";
        return value || "";
      },
      meta: { align: "text-left" }
    },
    {
      header: "Date de naissance",
      accessorKey: "dateOfBirth",
      cell: ({ getValue }: { getValue: () => string }) => {
        const value = getValue();
        if (!value) return "";
        return new Date(value).toLocaleDateString("fr-FR");
      },
      meta: { align: "text-left" },
    },
    { header: "CIN", accessorKey: "cin", meta: { align: "text-left" } },
    { header: "Téléphone", accessorKey: "phone", meta: { align: "text-left" } },
    { header: "Email", accessorKey: "email", meta: { align: "text-left" } },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-3">
          <Edit patient={row.original} onSuccess={handleRefresh} />
          <Delete patientId={row.original.id} onSuccess={handleRefresh} />
          <Button variant="primary" onClick={() => { router.push(`/mes-patients/root/${row.original.id}`)}} >
            <FolderSearch width={18} />
          </Button>
        </div>
      ),
      meta: { align: "text-left" },
    },
  ];

  const table = useReactTable({
    data: filteredPatients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const actualPage = table.getState().pagination.pageIndex + 1;
  const paginationCount = table.getPageCount();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                  Aucun patient trouvé.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cx(cell.column.columnDef.meta?.align)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Pagination Controls */}
      {paginationCount > 1 && (
        <div className="mt-10 flex items-center justify-between sm:justify-center">
          {/* Desktop Pagination */}
          <div className="hidden items-center rounded-full px-0.5 shadow-sm ring-1 ring-inset ring-gray-300 sm:inline-flex">
            <TextButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="group"
            >
              <span className="sr-only">Previous</span>
              <RiArrowLeftSLine
                className="size-5 text-gray-600 group-hover:text-gray-900"
                aria-hidden={true}
              />
            </TextButton>
            <span className="h-5 border-r border-gray-300" aria-hidden={true} />

            <NumberButton
              onClick={() => table.setPageIndex(0)}
              active={actualPage === 1}
            >
              1
            </NumberButton>

            {actualPage > 4 ? (
              actualPage < paginationCount - 2 ? (
                <>
                  <NumberButton
                    onClick={() => table.setPageIndex(actualPage - 3)}
                    active={false}
                  >
                    ...
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(actualPage - 2)}
                    active={false}
                  >
                    {actualPage - 1}
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(actualPage - 1)}
                    active={true}
                  >
                    {actualPage}
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(actualPage)}
                    active={false}
                  >
                    {actualPage + 1}
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(actualPage + 1)}
                    active={false}
                  >
                    ...
                  </NumberButton>
                </>
              ) : (
                <>
                  <NumberButton onClick={() => table.setPageIndex(1)} active={false}>
                    2
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(paginationCount - 5)}
                    active={false}
                  >
                    ...
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(paginationCount - 4)}
                    active={actualPage === paginationCount - 3}
                  >
                    {paginationCount - 3}
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(paginationCount - 3)}
                    active={actualPage === paginationCount - 2}
                  >
                    {paginationCount - 2}
                  </NumberButton>
                  <NumberButton
                    onClick={() => table.setPageIndex(paginationCount - 2)}
                    active={actualPage === paginationCount - 1}
                  >
                    {paginationCount - 1}
                  </NumberButton>
                </>
              )
            ) : (
              <>
                {paginationCount > 1 && (
                  <NumberButton
                    onClick={() => table.setPageIndex(1)}
                    active={actualPage === 2}
                  >
                    2
                  </NumberButton>
                )}
                {paginationCount > 2 && (
                  <NumberButton
                    onClick={() => table.setPageIndex(2)}
                    active={actualPage === 3}
                  >
                    3
                  </NumberButton>
                )}
                {paginationCount > 3 && (
                  <NumberButton
                    onClick={() => table.setPageIndex(3)}
                    active={actualPage === 4}
                  >
                    4
                  </NumberButton>
                )}
                {paginationCount > 5 && (
                  <>
                    <NumberButton
                      onClick={() => table.setPageIndex(4)}
                      active={false}
                    >
                      ...
                    </NumberButton>
                    <NumberButton
                      onClick={() => table.setPageIndex(paginationCount - 2)}
                      active={false}
                    >
                      {paginationCount - 1}
                    </NumberButton>
                  </>
                )}
              </>
            )}

            {paginationCount > 1 && (
              <NumberButton
                onClick={() => table.setPageIndex(paginationCount - 1)}
                active={actualPage === paginationCount}
              >
                {paginationCount}
              </NumberButton>
            )}

            <span className="h-5 border-r border-gray-300" />
            <TextButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="group"
            >
              <span className="sr-only">Next</span>
              <RiArrowRightSLine
                className="size-5 text-gray-600 group-hover:text-gray-900"
                aria-hidden={true}
              />
            </TextButton>
          </div>

          {/* Mobile Pagination Info */}
          <p className="text-sm tabular-nums text-gray-600 sm:hidden">
            Page{" "}
            <span className="font-medium text-gray-900">{actualPage}</span> of{" "}
            <span className="font-medium text-gray-900">{paginationCount}</span>
          </p>

          {/* Mobile Pagination Buttons */}
          <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300 sm:hidden">
            <MobileButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Previous</span>
              <RiArrowLeftSLine
                className="size-5 text-gray-600 group-hover:text-gray-900"
                aria-hidden={true}
              />
            </MobileButton>
            <span className="h-5 border-r border-gray-300" aria-hidden={true} />
            <MobileButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Next</span>
              <RiArrowRightSLine
                className="size-5 text-gray-600 group-hover:text-gray-900"
                aria-hidden={true}
              />
            </MobileButton>
          </div>
        </div>
      )}
    </>
  );
}