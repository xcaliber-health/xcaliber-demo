import React from 'react';

import type { FilterFn } from '@tanstack/react-table';
import {
useReactTable,
getCoreRowModel,
getFilteredRowModel,
getSortedRowModel,
getPaginationRowModel,
flexRender
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Card, TablePagination } from '@mui/material';

import tableStyles from '../../styles/table.module.css';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
const itemRank = rankItem(row.getValue(columnId), value);

addMeta({ itemRank });

return itemRank.passed;
};

export default function SQLTable({ columns, data, cardStyles }: { columns: any, data: any, cardStyles: any }) {
const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: { fuzzy: fuzzyFilter },
});

return (
    <Card>
    <div style={cardStyles}>
        <PerfectScrollbar>
        <div style={{ minWidth: '100%', width: 'max-content' }}>
            <table className={tableStyles.table}>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                    <th key={header.id} style={{ position: 'sticky', top: 0, zIndex: 1}}>
                        <div className='flex items-center justify-center'>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                        <div className='flex items-center justify-center'>
                        {cell.getValue() === null ? '-' : flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </PerfectScrollbar>
    </div>
    <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        className='border-bs'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        SelectProps={{
        inputProps: { 'aria-label': 'rows per page' }
        }}
        onPageChange={(_, page) => {
        table.setPageIndex(page);
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
    />
    </Card>
);
}