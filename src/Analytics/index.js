import { Button, Grid, TextField } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { BUTTON_LABELS } from "../core-utils/constants";
import { AnalyticService } from "../services/Analytics";
import LensTable from "./LensTable";

export default function Terminology() {
  const theme = useTheme();
  const [lensData, setLensData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (lensData && lensData !== null) {
      if (loading) setLoading(false);
    }
  }, [lensData]);
  return (
    <Grid width={"80%"} height={`100%`} container direction="column">
      <Grid
        container
        item
        justifyContent="space-around"
        sx={{ marginBottom: theme.spacing(2) }}
      >
        <Grid item>
          <TextField label="select" size="small" />
        </Grid>
        <Grid item>
          <TextField label="where" size="small" />
        </Grid>
        <Grid item>
          <Button
            onClick={async () => {
              setLoading(true);
              const result = await AnalyticService.discoverLens();
              setLensData(result);
            }}
            variant="contained"
          >
            {BUTTON_LABELS.RUN}
          </Button>
        </Grid>
      </Grid>

      <Grid item>
        {!loading && <LensTable tableRowData={lensData} />}
        {loading && "Searching"}
      </Grid>
    </Grid>
  );
}
