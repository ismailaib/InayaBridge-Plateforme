import React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from '@tanstack/react-table';

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
import {useTranslations} from '@/lib/i18n/useTranslations';

const appointments = [
  {
    patient: 'Youssef El Amrani',
    status: 'confirmé',
    date: '2025-05-28',
    time: '10:00',
    duration: '30 min',
    type: 'Consultation',
    lastUpdated: '2025-05-25 14:30',
  },
  {
    patient: 'Fatima Zahra',
    status: 'en attente',
    date: '2025-05-28',
    time: '11:00',
    duration: '45 min',
    type: 'Suivi',
    lastUpdated: '2025-05-25 13:45',
  },
  {
    patient: 'Hassan Yassine',
    status: 'annulé',
    date: '2025-05-27',
    time: '09:30',
    duration: '20 min',
    type: 'Urgence',
    lastUpdated: '2025-05-25 10:15',
  },
  {
    patient: 'Nadia Kabbaj',
    status: 'confirmé',
    date: '2025-05-29',
    time: '15:00',
    duration: '30 min',
    type: 'Consultation',
    lastUpdated: '2025-05-25 16:00',
  },
  {
    patient: 'Mohamed Idrissi',
    status: 'confirmé',
    date: '2025-05-30',
    time: '08:45',
    duration: '25 min',
    type: 'Suivi',
    lastUpdated: '2025-05-25 12:00',
  },
];



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

export default function Example() {
  const pageSize = 8;

    const t = useTranslations("appointments.history.table")

const appointmentsColumns = [
    {
      header: t("patient"),
      accessorKey: "patient",
      meta: { align: "text-left" },
    },
    {
      header: t("status"),
      accessorKey: "status",
      meta: { align: "text-left" },
    },
    {
      header: t("date"),
      accessorKey: "date",
      meta: { align: "text-left" },
    },
    {
      header: t("time"),
      accessorKey: "time",
      meta: { align: "text-right" },
    },
    {
      header: t("duration"),
      accessorKey: "duration",
      meta: { align: "text-right" },
    },
    {
      header: t("type"),
      accessorKey: "type",
      meta: { align: "text-left" },
    },
    {
      header: t("lastUpdated"),
      accessorKey: "lastUpdated",
      meta: { align: "text-right" },
    },
  ]

  const data = React.useMemo(
    // multiply dummy data to better demonstrate pagination over several pages
    () => [
      ...appointments,
      ...appointments,
      ...appointments,
      ...appointments,
      ...appointments,
      ...appointments,
      ...appointments,
    ],
    [],
  );
  const table = useReactTable({
    data: data,
    columns: appointmentsColumns,
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
            {table.getRowModel().rows.map((row) => (
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
            ))}
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
          <span className="font-medium text-gray-900 dark:text-gray-50">{`${
            table.getState().pagination.pageIndex + 1
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