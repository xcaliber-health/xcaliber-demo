// React Imports
import { useEffect, useMemo, useState } from "react";

// MUI Imports
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
import classnames from "classnames";
import { fetchVitals } from "./utils/getPatientVitals";

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

// Vital Details Data
const vitalDetails = [
  {
    measurement: "Weight",
    value: "165 lbs",
    last_updated: "Tue Dec 31 2024, 04:00 PM",
    action: "view/edit",
  },
  {
    measurement: "Blood Pressure",
    value: "118/76 mmHg",
    last_updated: "N/A",
    action: "view/edit",
  },
  {
    measurement: "Height",
    value: "69 inches",
    last_updated: "N/A",
    action: "view/edit",
  },
  {
    measurement: "BMI",
    value: "24.4",
    last_updated: "N/A",
    action: "view/edit",
  },
  {
    measurement: "Body Temperature",
    value: "98.2 F",
    last_updated: "N/A",
    action: "view/edit",
  },
  {
    measurement: "Pulse Rate",
    value: "72 bpm",
    last_updated: "N/A",
    action: "view/edit",
  },
  {
    measurement: "Respiration Rate",
    value: "14 breaths/min",
    last_updated: "N/A",
    action: "view/edit",
  },
];

// Column Definitions
const columnHelper = createColumnHelper();

const VitalsTable = ({ id }: VitalsTableProps) => {
  // States
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<VitalsProps[]>([...vitalDetails]);
  // const [data, setData] = useState<VitalsProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchVitals(id);
        setData(response);
      } catch (error) {
        console.error("Error fetching vitals:", error);
      }
    };

    fetchData();
  }, [id]);

  console.log("vitals", data);

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
        <CardHeader title="Vitals" className="flex flex-wrap gap-4" />
        <Button variant="outlined" color="inherit" className="mr-12">
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
                          desc: <i className="ri-arrow-down-s-line text-xl" />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
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
    </Card>
  );
};

export default VitalsTable;
