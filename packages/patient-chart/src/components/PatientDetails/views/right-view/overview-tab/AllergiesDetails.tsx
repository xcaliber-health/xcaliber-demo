// React Imports
import { useState, useEffect, useMemo } from "react";

// Mui Imports
import tableStyles from "@core/styles/table.module.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";

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
import { fetchAllergies } from "./utils/getPatientAllergies";

// React Icons
import { FaEye, FaPen } from "react-icons/fa";

export interface AllergyProps {
  allergy: string;
  status: string;
  description: string;
  last_updated: string;
  action: string;
}

const AllergiesTable = ({ id }: { id?: string }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<AllergyProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllergies(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching allergies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columnHelper = createColumnHelper<AllergyProps>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("allergy", {
        header: "Allergy",
        cell: ({ row }) => (
          <Typography sx={{ color: "#0047FF" }} className="font-medium">
            {row.original.allergy}
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
      {Array.from({ length: rowsPerPage }).map((_, index) => (
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

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page change
  };

  return (
    <Card>
      <div className="p-4 flex justify-between items-center">
        <CardHeader title="Allergies" />
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
        count={data.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[7, 10, 25]}
      />
    </Card>
  );
};

export default AllergiesTable;
