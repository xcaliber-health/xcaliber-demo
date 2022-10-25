import { Grid, Table, TextField,Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { APP_MESSAGES } from "../core-utils/constants";
import { TerminologyService } from "../services/Terminology";
import SearchTable from "../Terminology/SearchTable";

export default function Terminology() {
  const { TYPING_HEADING } = APP_MESSAGES;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  return (
    <Grid direction={"column"} container width={"100%"} height={`100%`}>
      <Grid item><Typography>{TYPING_HEADING}</Typography></Grid>
      <Grid item>
        <TextField
          onChange={async (e) => {
            if (e.target.value?.length === 0) {
              setTableData([]);
            } else if (e.target.value?.length >= 3) {
              setLoading(true);
              const result = await TerminologyService.getSnomedResultsByTerm(
                e.target.value
              );
              setTableData([result]);
              setLoading(false);
            }
          }}
          sx={{
            pt: theme.spacing(1),
            pb: theme.spacing(1),
            width: theme.spacing(100),
            height: theme.spacing(8),
          }}
        />
      </Grid>
      {loading && <Grid sx={{ p: "10px" }}>{`Searching`}</Grid>}
      <Grid item>
        <SearchTable tableRowData={tableData} />
      </Grid>
    </Grid>
  );
}
