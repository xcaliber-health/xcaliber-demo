import { Button, Grid, TextField } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { BUTTON_LABELS } from "../core-utils/constants";
import { AnalyticService } from "../services/Analytics";
import LensTable from "./LensTable";

export default function Terminology() {
  let result = []
  const theme = useTheme();
  const [lensData, setLensData] = useState([]);
  const [flag, setFlag] = useState(0);
  const [data, setData] = useState([
    { Allergies: [] },
    { FamilyHistory: [] },
    { Immunizations: [] },
    { Insurance: [] },
    { Medications: [] },
    { Patient: {} },
    { Patient_ID: '' },
    { Problems: [] },
    { Procedures: [] },
    { Vitals: [] }
  ])
  // const [tableData,setTableData]=useState([

  // ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data && data !== null) {
      setLoading(false);
    }
  }, [data]);
  return (
    <Grid container direction="column">
      <Grid
        container
        item
        display="block"
        justifyContent="space-between"
        sx={{ marginBottom: theme.spacing(2) }}
      >
        <Grid item>
          <TextField label="query" sx={{ marginRight: "20px", width: "1000px", marginBottom: "20px" }} minRows={10}
            multiline
            value={lensData}
            onChange={(e) => { setLensData(e.target.value) }} />
        </Grid>

        <Grid item>
          <Button
            onClick={async () => {
              setLoading(true);
              console.log(lensData);
              result = await AnalyticService.discoverLens({query : lensData});
              setData(result);
              setFlag(1);
            }}
            variant="contained"
            sx={{ marginLeft: "938px" }}
          >
            {BUTTON_LABELS.RUN}
          </Button>
        </Grid>
      </Grid>

      <Grid item>
        {
          !loading && <LensTable tableRowData={data} flag={flag} />}
        {loading && "Searching"}
      </Grid>
    </Grid>
  );
}
