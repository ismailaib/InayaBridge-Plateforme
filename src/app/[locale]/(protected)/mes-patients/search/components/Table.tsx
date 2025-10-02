"use client"

import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    RowData,
    useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import { cx } from '@/lib/utils';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRoot,
    TableRow,
} from '@/components/Table';

import { getDoctorPatients, Patient } from '../../api/patients';
import Delete from './Delete';
import Edit from './Edit';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        align: string;
    }
}


const TextButton = ({
    onClick,
    disabled,
    children,
}: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) => {
    return (
        <button
            type="button"
            className="group rounded-md p-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const NumberButton = ({
    active,
    onClick,
    children,
    position,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    position?: 'left' | 'right';
}) => {
    return (
        <button
            type="button"
            className={cx(
                'min-w-[30px] border-b-2 p-2 text-sm text-gray-900 dark:text-gray-50',
                active
                    ? 'border-blue-500 font-semibold dark:border-blue-500'
                    : 'border-transparent hover:border-gray-300 hover:dark:border-gray-800',
                position === 'left'
                    ? 'rounded-l-md'
                    : position === 'right'
                        ? 'rounded-r-md'
                        : '',
            )}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
        >
            {children}
        </button>
    );
};

const MobileButton = ({
    onClick,
    disabled,
    children,
}: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) => {
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

export default function Example({ refreshKey }: { refreshKey: number }) {
    const pageSize = 8;

    const [patients, setPatients] = useState<Patient[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        getDoctorPatients()
            .then((res) => { setPatients(res.data); console.log(res.data); })
            .catch((err) => {
                console.error("Failed to fetch patients", err);
            })
            .finally(() => setLoading(false));
    }, [refreshKey]);

    const patientsColumns = [
        {
            header: 'Nom',
            accessorKey: 'first_name',
            meta: {
                align: 'text-left',
            },
        },
        {
            header: 'Prénom',
            accessorKey: 'last_name',
            meta: {
                align: 'text-left',
            },
        },
        {
            header: 'Genre',
            accessorKey: 'gender',
            meta: {
                align: 'text-left',
            },
        },
        {
            header: 'Date de naissance',
            accessorKey: 'date_of_birth',
            cell: ({ getValue }: { getValue: () => string }) => {
                const value = getValue();
                if (!value) return '';
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR');
            },
            meta: {
                align: 'text-left',
            },
        },
        {
            header: 'CIN',
            accessorKey: 'cin',
            meta: {
                align: 'text-left',
            },
        },
        {
            header: 'Téléphone',
            accessorKey: 'phone_number',
            meta: {
                align: 'text-right',
            },
        },
        {
            header: 'Email',
            accessorKey: 'email',
            meta: {
                align: 'text-left',
            },
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: ({ row }: { row: any }) => {
                return (
                    <div className="flex items-center gap-3">
                        <Edit patient={row.original} onSuccess={() => {
                            getDoctorPatients()
                                .then((res) => setPatients(res.data))
                                .catch((err) => console.error("Failed to fetch patients", err));
                        }} />
                        <Delete patientId={row.original.id} onSuccess={() => {
                            getDoctorPatients()
                                .then((res) => setPatients(res.data))
                                .catch((err) => console.error("Failed to fetch patients", err));
                        }} />
                    </div>
                );
            },
            meta: {
                align: 'text-left',
            },
        },

    ];

    const data = React.useMemo(() => patients, [patients]);


    const table = useReactTable({
        data: data,
        columns: patientsColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: pageSize,
            },
        },
    });

    const paginationCount = table.getPageCount();
    const actualPage = table.getState().pagination.pageIndex + 1;



    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
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
                                        scope="col"
                                        className={cx(header.column.columnDef.meta?.align)}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </TableHeaderCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={patientsColumns.length} className="text-center py-8 text-gray-500">
                                    Aucun patient trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cx(cell.column.columnDef.meta?.align)}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableRoot>
            <div className="mt-10 flex items-center justify-between sm:justify-center">
                {/* long pagination button form only for desktop view */}
                <div className="hidden items-center rounded-full px-0.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 sm:inline-flex">
                    <TextButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Previous</span>
                        <RiArrowLeftSLine
                            className="size-5 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 group-hover:dark:text-gray-50"
                            aria-hidden={true}
                        />
                    </TextButton>
                    <span
                        className="h-5 border-r border-gray-300 dark:border-gray-800"
                        aria-hidden={true}
                    />
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
                                    active={actualPage === actualPage - 1}
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
                                    active={actualPage === actualPage + 1}
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
                                <NumberButton
                                    onClick={() => table.setPageIndex(1)}
                                    active={false}
                                >
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
                            <NumberButton
                                onClick={() => table.setPageIndex(1)}
                                active={actualPage === 2}
                            >
                                2
                            </NumberButton>
                            <NumberButton
                                onClick={() => table.setPageIndex(2)}
                                active={actualPage === 3}
                            >
                                3
                            </NumberButton>
                            <NumberButton
                                onClick={() => table.setPageIndex(3)}
                                active={actualPage === 4}
                            >
                                4
                            </NumberButton>
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
                    <NumberButton
                        onClick={() => table.setPageIndex(paginationCount - 1)}
                        active={actualPage === paginationCount}
                    >
                        {paginationCount}
                    </NumberButton>
                    <span className="h-5 border-r border-gray-300 dark:border-gray-800" />
                    <TextButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Next</span>
                        <RiArrowRightSLine
                            className="size-5 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 group-hover:dark:text-gray-50"
                            aria-hidden={true}
                        />
                    </TextButton>
                </div>
                <p className="text-sm tabular-nums text-gray-500 dark:text-gray-500 sm:hidden">
                    Page of{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-50">{`${table.getState().pagination.pageIndex + 1
                        }`}</span>{' '}
                    of
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                        {' '}
                        {`${table.getPageCount()}`}
                    </span>
                </p>
                {/*  */}
                <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 sm:hidden">
                    <MobileButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Previous</span>
                        <RiArrowLeftSLine
                            className="size-5 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 group-hover:dark:text-gray-50"
                            aria-hidden={true}
                        />
                    </MobileButton>
                    <span
                        className="h-5 border-r border-gray-300 dark:border-gray-800"
                        aria-hidden={true}
                    />
                    <MobileButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Next</span>
                        <RiArrowRightSLine
                            className="size-5 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 group-hover:dark:text-gray-50"
                            aria-hidden={true}
                        />
                    </MobileButton>
                </div>
            </div>
        </>
    );
}
