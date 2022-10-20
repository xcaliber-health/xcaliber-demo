import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  Grid,
  TableHead,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect } from "react";

export default function LensTable({ tableRowData }) {
  const theme = useTheme();
  return (
    <Table sx={{ mt: theme.spacing(2) }} aria-label="simple table">
      <TableHead>
        <TableRow>
          {tableRowData?.[0] &&
            Object.keys(tableRowData[0])?.map((header, index) => {
              return <TableCell>{header ?? "null"}</TableCell>;
            })}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableRowData?.[0] &&
          tableRowData?.map((tableData, index) => {
            return (
              <TableRow key={index}>
                {Object.values(tableData).map((cellValue, index) => {
                  return <TableCell>{cellValue ?? "null"}</TableCell>;
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
