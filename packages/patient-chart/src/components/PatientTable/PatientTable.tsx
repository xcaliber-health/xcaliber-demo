"use client";

// React Imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Style Imports
import styles from "@core/styles/table.module.css";

// Dummy Data
const defaultData = [
  {
    id: 1,
    name: "#(kalitha) Fname",
    gender: "unknown",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 2,
    name: "#(kalitha) Fname",
    gender: "unknown",
    dob: "01/13/1968",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 3,
    name: "#(returnName) Fname",
    gender: "man",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 4,
    name: "#(returnName) Fname",
    gender: "man",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 5,
    name: "#(returnName) Fname",
    gender: "man",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 6,
    name: "#(returnName) Fname",
    gender: "man",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 7,
    name: "#(returnName) Fname",
    gender: "man",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
  {
    id: 8,
    name: "#(returnName) Fname",
    gender: "man",
    dob: "01/13/1967",
    email: "test@gmail.com",
    city: "Test City",
    state: "Test State",
    phone: "9876543456",
  },
];

// Column Definitions
const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name",
  }),
  columnHelper.accessor("gender", {
    cell: (info) => info.getValue(),
    header: "Gender",
  }),
  columnHelper.accessor("dob", {
    cell: (info) => info.getValue(),
    header: "Date Of Birth",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Email",
  }),
  columnHelper.accessor("city", {
    cell: (info) => info.getValue(),
    header: "City",
  }),
  columnHelper.accessor("state", {
    cell: (info) => info.getValue(),
    header: "State",
  }),
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue(),
    header: "Phone",
  }),
];

function PatientTable() {
  // States
  const [data, setData] = useState(() => [...defaultData]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Hooks
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRowClick = (id: number) => {
    router.push(`/patient/${id}`);
  };

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
