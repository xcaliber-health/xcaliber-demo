import {
  ListItemButton,
  Paper,
  ListItemText,
  TableCell,
  TableRow,
  Table,
  Grid,
  Drawer,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AppBar from "@mui/material/AppBar";
import TabPanel from "./modal";

function SimpleDialog(props) {
  const { onClose, open, data } = props;
  const handleClose = () => {
    onClose(false);
  };
  const [value, setValue] = useState(0);
  const handleChange = (event, value) => {
    setValue(value);
  };
  return (
    <Drawer onClose={handleClose} open={open} anchor="right">
      <Typography
        style={{
          paddingTop: "50px",
          paddingBlock: "30px",
          paddingLeft: "30px",
        }}
        variant="h5"
      >
        {data?.term}
      </Typography>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Summary" />
          <Tab label="Representation" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {" "}
        <ComingSoon />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {" "}
        <ComingSoon />
      </TabPanel>
    </Drawer>
  );
}

export default function SearchTable({ tableRowData }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState();
  const onSearchResultsClick = (rowData) => {
    setOpen(true);
    setSelected(rowData);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    tableRowData[0] && (
      <Paper style={{ marginTop: theme.spacing(4), overflow: "scroll" }}>
        {tableRowData[0].map((rowData, index) => {
          return (
            <ListItemButton
              onClick={() => {
                onSearchResultsClick(rowData);
              }}
              style={{ flexDirection: "column", alignItems: "flex-start" }}
              divider
              key={rowData.id}
            >
              <ListItemText primary={rowData?.term} />
              <ListItemText secondary={rowData?.concept?.fsn?.term} />
            </ListItemButton>
          );
        })}

        {/* <Table
      sx={{ maxWidth: 250, mt: theme.spacing(2) }}
      aria-label="simple table"
    >
      <TableBody>
          {tableRowData[0].map((rowData, index) => {
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
    </Table> */}
        <SimpleDialog open={open} onClose={handleClose} data={selected} />
      </Paper>
    )
  );
}
