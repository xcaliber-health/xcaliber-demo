import { useState, useEffect, useCallback } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Skeleton from "@mui/material/Skeleton";

// Service Import
import { getPatientsAtPage } from "./services/service.ts";

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Style Import
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
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced search state
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const onPatientSelect = (id: string) => {
    const event = new CustomEvent("patientSelected", {
      detail: { patientId: id },
    });
    window.dispatchEvent(event);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Debouncing function
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch Patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const result = await getPatientsAtPage(page, debouncedSearch);
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced Search Handler
  const handleSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    handleSearch(query);
  };

  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch, page]);

  const handleRowClick = (id: string) => {
    onPatientSelect(id);
  };

  return (
    <Card>
      <CardHeader title="Patient Table" />
      <div className="p-4 flex justify-between items-center">
        <TextField
          variant="outlined"
          placeholder="Search by Name"
          value={search}
          onChange={handleInputChange}
          margin="normal"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: "300px" }}
        />
        <Button variant="contained" color="primary">
          Create Patient
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className={styles.table}>
          {/* Table Header */}
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

          {/* Table Body */}
          <tbody>
            {loading
              ? // Shimmer Effect: Render Skeleton Rows for Loading State
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {columns.map((col, colIndex) => (
                      <td key={`skeleton-${index}-${colIndex}`}>
                        <Skeleton variant="text" width="100%" height={24} />
                      </td>
                    ))}
                  </tr>
                ))
              : // Render Actual Data
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.original.id)}
                    style={{ cursor: "pointer" }}
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
        </table>
      </div>
    </Card>
  );
}

export default PatientTable;
