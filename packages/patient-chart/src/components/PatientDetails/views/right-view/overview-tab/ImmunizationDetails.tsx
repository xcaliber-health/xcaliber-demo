// React Imports
import { useEffect, useMemo, useState } from "react";

// Mui Imports
import tableStyles from "@core/styles/table.module.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
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

const immunizationDetails = [
  {
    immunization: "COVID-19 Vaccine",
    status: "Active",
    description: "First and second dose completed.",
    last_updated: "Fri Dec 27 2024, 03:45 PM",
    action: "view/edit",
  },
  {
    immunization: "Tetanus",
    status: "Active",
    description: "Up to date with the booster.",
    last_updated: "Thu Dec 26 2024, 10:15 AM",
    action: "view/edit",
  },
  {
    immunization: "Flu Shot",
    status: "Inactive",
    description: "Missed for the current year.",
    last_updated: "Wed Dec 25 2024, 01:00 PM",
    action: "view/edit",
  },
];

const ImmunizationsTable = ({ id }: { id?: string }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ImmunizationProps[]>([
    ...immunizationDetails,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchImmunizations(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching immunizations:", error);
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
        cell: ({ row }) => {
          // const action = row.original.action;

          return (
            <div className="flex gap-2">
              <FaEye className="cursor-pointer" />
              <FaPen
                className="
                 cursor-pointer"
              />
            </div>
          );
        },
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
        pageSize: 7,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
          {table.getFilteredRowModel().rows.length === 0 ? (
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
    </Card>
  );
};

export default ImmunizationsTable;
