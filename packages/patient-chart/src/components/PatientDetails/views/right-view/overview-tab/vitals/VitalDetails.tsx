// React Imports
import { useEffect, useMemo, useState } from "react";

// MUI Imports
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
import classnames from "classnames";
import { fetchVitals } from "../utils/getPatientVitals";
import CreateVitals from "./CreateVitals";

// React Icons
import { FaEye, FaPen } from "react-icons/fa";

// Style Imports
import tableStyles from "@core/styles/table.module.css";

interface VitalsTableProps {
  id?: string;
}

export interface VitalsProps {
  measurement: string;
  value: string;
  last_updated: string;
  action: string;
}

// Column Definitions
const columnHelper = createColumnHelper();

const VitalsTable = ({ id }: VitalsTableProps) => {
  // States
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<VitalsProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchVitals(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching vitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Columns definition
  const columns = useMemo(
    () => [
      columnHelper.accessor("measurement", {
        header: "Measurement",
        cell: ({ row }) => (
          <Typography sx={{ color: "#0047FF" }} className="font-medium">
            {row.original.measurement}
          </Typography>
        ),
      }),
      columnHelper.accessor("value", {
        header: "Value",
        cell: ({ row }) => (
          <Typography sx={{ color: "#2e263dd3" }}>
            {row.original.value}
          </Typography>
        ),
      }),
      columnHelper.accessor("last_updated", {
        header: "Last Updated",
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.last_updated}
          </Typography>
        ),
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Card>
        <div className="p-4 flex justify-between items-center">
          <CardHeader title="Vitals" className="flex flex-wrap gap-4" />
          <CreateVitals patientId={id} />
        </div>

        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            "flex items-center": header.column.getIsSorted(),
                            "cursor-pointer select-none text-[#2e263d] font-medium":
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="ri-arrow-up-s-line text-xl" />,
                            desc: (
                              <i className="ri-arrow-down-s-line text-xl" />
                            ),
                          }[header.column.getIsSorted()] ?? null}
                        </div>
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
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row) => (
                    <tr
                      key={row.id}
                      className={classnames({ selected: row.getIsSelected() })}
                    >
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
    </>
  );
};

export default VitalsTable;
