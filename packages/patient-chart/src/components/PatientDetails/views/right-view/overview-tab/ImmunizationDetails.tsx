// React Imports
import { useEffect, useMemo, useState } from "react";

// Mui Imports
import tableStyles from "@core/styles/table.module.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchImmunizations } from "./utils/getPatientImmunizations";

// React Icons
import { FaEye, FaPen } from "react-icons/fa";

export interface ImmunizationProps {
  immunization: string;
  status: string;
  description: string;
  last_updated: string;
  action: string;
}

const ImmunizationsTable = ({ id }: { id?: string }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ImmunizationProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchImmunizations(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching immunizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columnHelper = createColumnHelper<ImmunizationProps>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("immunization", {
        header: "Immunization",
        cell: ({ row }) => (
          <Typography sx={{ color: "#0047FF" }} className="font-medium">
            {row.original.immunization}
          </Typography>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <Typography sx={{ color: "#2e263dd3" }}>
            {row.original.status}
          </Typography>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ row }) => (
          <Typography sx={{ color: "#2e263dd3" }}>
            {row.original.description}
          </Typography>
        ),
      }),
      columnHelper.accessor("last_updated", {
        header: "Last Updated",
        cell: ({ row }) => <Typography>{row.original.last_updated}</Typography>,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <FaEye className="cursor-pointer" />
            <FaPen className="cursor-pointer" />
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const renderShimmer = () => (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={`skeleton-${index}`}>
          {columns.map((col, colIndex) => (
            <td key={`skeleton-${index}-${colIndex}`} className="p-4">
              <Skeleton variant="text" width="100%" height={24} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <Card>
      <div className="p-4 flex justify-between items-center">
        <CardHeader title="Immunizations" />
        <Button variant="outlined" color="inherit">
          +CREATE
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {loading ? (
            renderShimmer()
          ) : table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={table.getVisibleFlatColumns().length}
                  className="text-center"
                >
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, newPage) => table.setPageIndex(newPage)}
        rowsPerPage={table.getState().pagination.pageSize}
        onRowsPerPageChange={(event) => {
          const newPageSize = parseInt(event.target.value, 10);
          table.setPageSize(newPageSize);
        }}
        rowsPerPageOptions={[7, 10, 25]}
      />
    </Card>
  );
};

export default ImmunizationsTable;
