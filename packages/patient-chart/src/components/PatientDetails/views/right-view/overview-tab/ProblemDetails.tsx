import tableStyles from "@core/styles/table.module.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
// import { fetchProblems } from "./utils/getPatientProblems";

// React Icons
import { FaEye, FaPen } from "react-icons/fa";

interface ProblemProps {
  problem: string;
  status: string;
  description: string;
  last_updated: string;
  action: string;
}

const problemDetails = [
  {
    problem: "Name",
    status: "Active",
    description: "asdf",
    last_updated: "Tue Dec 31 2024, 04:00 PM",
    action: "view/edit",
  },
  {
    problem: "Name",
    status: "Active",
    description: "asdf",
    last_updated: "Tue Dec 31 2024, 04:00 PM",
    action: "view/edit",
  },
  {
    problem: "Name",
    status: "Inactive",
    description: "asdf",
    last_updated: "Tue Dec 31 2024, 04:00 PM",
    action: "view/edit",
  },
];

const ProblemsTable = ({ id }: { id?: string }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ProblemProps[]>([...problemDetails]);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetchProblems(id);
  //         setData(response);
  //       } catch (error) {
  //         console.error("Error fetching problems:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [id]);

  const columnHelper = createColumnHelper<ProblemProps>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("problem", {
        header: "Problem",
        cell: ({ row }) => (
          <Typography sx={{ color: "#0047FF" }} className="font-medium">
            {row.original.problem}
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
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <div className="p-4 flex justify-between items-center">
        <CardHeader title="Problems" />
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
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProblemsTable;
