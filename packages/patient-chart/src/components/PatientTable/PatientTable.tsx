import { useState, useEffect, useCallback } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";

// Service Import
import { getPatientsAtPage, addPatient } from "./services/service.ts";

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import SideDrawer from "../ui/SideDrawer.tsx";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  
  const formFields = [
    { name: "givenName", label: "Given Name", type: "text" },
    { name: "middleName", label: "Middle Name", type: "text" },
    { name: "familyName", label: "Family Name", type: "text" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "sex", label: "Gender", type: "select", options: ["Male", "Female", "Gender non-conforming"] },
    { name: "address", label: "Address", type: "textarea" },
    { name: "phoneNumbers", label: "Phone Numbers (Comma-separated)", type: "text" },
    { name: "emails", label: "Emails (Comma-separated)", type: "text" },
    { name: "emergencyContactName", label: "Emergency Contact Name", type: "text" },
    { name: "emergencyContactPhone", label: "Emergency Contact Phone", type: "text" },
    { name: "emergencyContactRelationship", label: "Emergency Contact Relationship", type: "text" },
    { name: "emergencyContactAddress", label: "Emergency Contact Address", type: "textarea" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const result = await getPatientsAtPage(page + 1, debouncedSearch, {
        pageSize: rowsPerPage,
      });
      setData(result || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearch(query);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  };

  useEffect(() => {
    fetchPatients();
  }, [debouncedSearch, page, rowsPerPage]);

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number; // Return unmodified if not 10 digits
  };

  const handleCreatePatient = async (formData) => {
    const address = typeof formData.address === "string" ? formData.address : "";

    const patientData = {
      givenName: formData.givenName,
      middleName: formData.middleName,
      familyName: formData.familyName,
      dateOfBirth: formData.dateOfBirth,
      sex: formData.sex,
      address,
      phoneNumbers: formData.phoneNumbers
        ? formData.phoneNumbers.split(",").map((phone, index) => ({
            value: formatPhoneNumber(phone.trim()),
            type: ["home", "work", "mobile"][index] || "other",
          }))
        : [],
      emails: formData.emails
        ? formData.emails.split(",").map((email) => ({ value: email.trim() }))
        : [],
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formatPhoneNumber(formData.emergencyContactPhone),
        relationship: formData.emergencyContactRelationship,
        address: formData.emergencyContactAddress,
      },
      notes: formData.notes,
    };

    try {
      await addPatient(patientData);
      setIsDrawerOpen(false);
      fetchPatients();
      toast.success("Patient created successfully!");
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to create patient. Please try again.");
    }
  };

  const handleRowClick = (id: string) => {
    const event = new CustomEvent("patientSelected", {
      detail: { patientId: id },
    });
    window.dispatchEvent(event);
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
        <Button variant="contained" color="primary" onClick={() => setIsDrawerOpen(true)}>
          Create Patient
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {columns.map((_, colIndex) => (
                      <td key={`skeleton-${index}-${colIndex}`}>
                        <Skeleton variant="text" width="100%" height={24} />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
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
      <TablePagination
        component="div"
        count={200}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
      />
      <SideDrawer
        title="Create New Patient"
        formFields={formFields}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreatePatient}
      />
      <ToastContainer />
    </Card>
  );
}

export default PatientTable;
