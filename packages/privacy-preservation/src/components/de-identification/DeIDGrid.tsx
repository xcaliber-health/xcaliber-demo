'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import IconButton from '@mui/material/IconButton'

import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { Chip } from '@mui/material'

import type { FilesType } from '@/types/userTypes'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'


// Style Imports
import tableStyles from '../../styles/table.module.css'
import DiffDialog from './DiffDialog'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type FilesTypeWithAction = FilesType & {
    previewOgiginalContent?: string
    previewDeIDContent?: string
    previewDiffContent?: string
    action?: string
  }

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars

const fileTypeObj: any = {
    HL7: 'primary',
    FHIR: 'warning',
    CSV: 'info',
    MRN: 'success'
  }

const filesColumnHelper = createColumnHelper<FilesTypeWithAction>()

const DeIDGrid = ({filesData, token }: { filesData?: FilesType[], token?: string }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [filteredFilesData, setFilteredFilesData] = useState(filesData)
  const [fileSelected, setFileSelected] = useState<FilesType>()
  const [operation, setOperation] = useState<'Original' | 'De-Identify'>('Original')
  const [dialogOpen, setDialogOpen] = useState(false)

//   const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks

  const filesColumns = useMemo<ColumnDef<FilesType, any>[]>(() => [
    filesColumnHelper.accessor('id', {
        header: 'File ID',
        cell: ({ row }) => 
        <div className='flex justify-center'>
            <Typography>{row.original.id}</Typography>
        </div>
      }),
      filesColumnHelper.accessor('name', {
        header: 'File Name',
        cell: ({ row }) => 
        <div className='flex justify-center'>
            <Typography>{row.original.name}</Typography>
        </div>
      }),
    filesColumnHelper.accessor('type', {
      header: 'File Type',
      cell: ({ row }) => {
        return (
            <div className='flex justify-center items-center gap-3'>
                <Chip
                variant='tonal'
                label={row.original.type}
                size='small'
                color={fileTypeObj[row.original.type]}
                className='capitalize'
                />
            </div>
        )
      }
    }),
    filesColumnHelper.accessor('description', {
      header: 'File Description',
      cell: ({ row }) => 
      <div className='flex justify-center'>
        <Typography>{row.original.description}</Typography>
      </div>
    }),
    filesColumnHelper.accessor('lastUpdated', {
      header: 'Last Updated (Date/Time)',
      cell: ({ row }) => 
      <div className='flex justify-center'>
        <Typography>{row.original.lastUpdated}</Typography>
      </div>
    }),
    filesColumnHelper.accessor('previewOgiginalContent', {
        header: 'Identifiable View',
        cell: ({ row }) => <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <IconButton onClick={() => {
            setAddUserOpen(true)
            setFileSelected(row.original)
            setOperation('Original')
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14q.825 0 1.413-.587T14 12t-.587-1.412T12 10t-1.412.588T10 12t.588 1.413T12 14m-4 4h8v-.575q0-.6-.325-1.1t-.9-.75q-.65-.275-1.338-.425T12 15t-1.437.15t-1.338.425q-.575.25-.9.75T8 17.425zm10 4H6q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.587 1.413T18 22"/></svg>
          </IconButton>
        </div>,
        enableSorting: false
      }),
      filesColumnHelper.accessor('previewDeIDContent', {
        header: 'De-identified View',
        cell: ({ row }) => <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <IconButton onClick={() => {
            setAddUserOpen(true)
            setFileSelected(row.original)
            setOperation('De-Identify')
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11c.34 0 .67.04 1 .09V6.27L10.5 3L3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82c.55-.13 1.08-.32 1.6-.55c-.69-.98-1.1-2.17-1.1-3.45c0-3.31 2.69-6 6-6"/><path fill="currentColor" d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12s-1.12-.51-1.12-1.12s.5-1.12 1.12-1.12m0 5.37c-.93 0-1.74-.46-2.24-1.17c.05-.72 1.51-1.08 2.24-1.08s2.19.36 2.24 1.08c-.5.71-1.31 1.17-2.24 1.17"/></svg>
          </IconButton>
        </div>,
        enableSorting: false
      }),
      filesColumnHelper.accessor('previewDiffContent', {
        header: 'Compare Views',
        cell: ({ row }) => <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <IconButton onClick={() => {
            setDialogOpen(true)
            setFileSelected(row.original)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-5v2h5v13l-5-6v9h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-9 15H5l5-6m0-9H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h5v2h2V1h-2z"/></svg>
          </IconButton>
        </div>,
        enableSorting: false
      }),

    // filesColumnHelper.accessor('action', {
    //   header: 'Action',
    //   cell: ({ row }) => (
    //     <div className='flex items-center'>
    //       <IconButton onClick={() => {
    //         setAddUserOpen(true)
    //         setFileSelected(row.original)
    //         setOperation('Original')
    //       }}>
    //       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14q.825 0 1.413-.587T14 12t-.587-1.412T12 10t-1.412.588T10 12t.588 1.413T12 14m-4 4h8v-.575q0-.6-.325-1.1t-.9-.75q-.65-.275-1.338-.425T12 15t-1.437.15t-1.338.425q-.575.25-.9.75T8 17.425zm10 4H6q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.587 1.413T18 22"/></svg>
    //       </IconButton>
    //       <IconButton onClick={() => {
    //         setAddUserOpen(true)
    //         setFileSelected(row.original)
    //         setOperation('De-Identify')
    //       }}>
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11c.34 0 .67.04 1 .09V6.27L10.5 3L3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82c.55-.13 1.08-.32 1.6-.55c-.69-.98-1.1-2.17-1.1-3.45c0-3.31 2.69-6 6-6"/><path fill="currentColor" d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12s-1.12-.51-1.12-1.12s.5-1.12 1.12-1.12m0 5.37c-.93 0-1.74-.46-2.24-1.17c.05-.72 1.51-1.08 2.24-1.08s2.19.36 2.24 1.08c-.5.71-1.31 1.17-2.24 1.17"/></svg>
    //       </IconButton>
    //       <IconButton onClick={() => {
    //         setDialogOpen(true)
    //         setFileSelected(row.original)
    //       }}>
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-5v2h5v13l-5-6v9h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-9 15H5l5-6m0-9H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h5v2h2V1h-2z"/></svg>
    //       </IconButton>
    //     </div>
    //   ),
    //   enableSorting: false
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [filesData, filteredFilesData])

    const filesTable = useReactTable({
        data: filteredFilesData as FilesType[],
        columns: filesColumns,
        filterFns: {
        fuzzy: fuzzyFilter
        },
        state: {
        rowSelection,
        globalFilter
        },
        initialState: {
        pagination: {
            pageSize: 10
        }
        },
        enableRowSelection: true,
        globalFilterFn: fuzzyFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues()
    })

  return (
    <>
      <Card>
        <div className='flex justify-between p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
            <TableFilters setData={setFilteredFilesData} tableData={filesData} />
          <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Files'
              className='max-sm:is-full'
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {filesTable.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {filesTable.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={filesTable.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filesTable
                  .getRowModel()
                  .rows.slice(0, filesTable.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={filesTable.getFilteredRowModel().rows.length}
          rowsPerPage={filesTable.getState().pagination.pageSize}
          page={filesTable.getState().pagination.pageIndex}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onPageChange={(_, page) => {
            filesTable.setPageIndex(page)
          }}
          onRowsPerPageChange={e => filesTable.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(false)}
        fileSelected={fileSelected}
        operation={operation}
        token={token}
      />
      <DiffDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} token={token} fileSelected={fileSelected} />
    </>
  )
}

export default DeIDGrid
