import { useState, useEffect } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { getPatientsAtPage } from "./services/service.ts";

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Style Imports
import styles from "@core/styles/table.module.css";

// Column Definitions
const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("fullName", {
    cell: (info) => info.getValue(),
    header: "Name",
  }),
  columnHelper.accessor(
    (row) => {
      const legalSex = row.extension?.find(
        (ext: any) =>
          ext.url === "http://xcaliber-fhir/structureDefinition/legal-sex"
      )?.valueCode;
      return legalSex || "Unknown";
    },
    {
      id: "gender",
      header: "Gender",
    }
  ),
  columnHelper.accessor("dateOfBirth", {
    cell: (info) => info.getValue(),
    header: "Date Of Birth",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue() || "-",
    header: "Email",
  }),
  columnHelper.accessor(
    (row) => {
      const address = row.addresses?.[0]?.value;
      return address || "-";
    },
    {
      id: "address",
      header: "Address",
    }
  ),
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue() || "-",
    header: "Phone",
  }),
];

function PatientTable() {
  // States
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const onPatientSelect = (id: string) => {
    // Emit an event that parent application can listen to
    const event = new CustomEvent("patientSelected", {
      detail: { patientId: id },
    });
    window.dispatchEvent(event);
  };
  const [page, setPage] = useState(1);

  // Hooks
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRowClick = (id: string) => {
    onPatientSelect(id);
  };

  const fetchPatients = async () => {
    const d = await getPatientsAtPage(page, search);
    if (d) {
      setData(d);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <Card>
      <CardHeader title='Patient Table' />
      <div className='p-4 flex justify-between items-center'>
        <TextField
          variant='outlined'
          placeholder='Search'
          value={search}
          onChange={handleSearch}
          margin='normal'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: "300px" }}
        />
        <Button variant='contained' color='primary'>
          Create Patient
        </Button>
      </div>
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                style={{ cursor: "pointer" }}
              >
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
}

export default PatientTable;
