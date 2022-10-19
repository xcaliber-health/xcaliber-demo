import { TableBody, TableCell, TableRow, Table, Grid } from "@mui/material";
import { useTheme } from "@mui/system";

export default function SearchTable({ tableRowData }) {
  const theme = useTheme();
  return (
    <Table
      sx={{ maxWidth: 250, mt: theme.spacing(2) }}
      aria-label="simple table"
    >
      <TableBody>
        {tableRowData[0] &&
          tableRowData[0].map((rowData, index) => {
            return (
              <TableRow key={index}>
                <TableCell sx={{ borderRight: "1px solid #E0E0E0" }}>
                  {rowData?.term}
                </TableCell>
                <TableCell>{rowData?.concept?.fsn?.term}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
