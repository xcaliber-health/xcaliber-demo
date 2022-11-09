import { Button, Grid, TextField } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { BUTTON_LABELS } from "../core-utils/constants";
import { AnalyticService } from "../services/Analytics";
import LensTable from "./LensTable";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Typography } from "@mui/material";
import { DataObject } from "@mui/icons-material";
import { MobileDatePicker } from "@mui/x-date-pickers";
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data && data !== null) {
      setLoading(false);
    }
  }, [data]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  useEffect(() => {
    if (start) {
      const dateObject = new Date(start);
      setStart(`${dateObject.getFullYear()}-${dateObject.getMonth() + 1
        }-${dateObject.getDate()}`);
    }
  }, [start]);
  useEffect(() => {
    if (end) {
      const dateObject = new Date(end);
      setEnd(`${dateObject.getFullYear()}-${dateObject.getMonth() + 1
        }-${dateObject.getDate()}`);
    }
  }, [end]);
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
          <TextField label="query" sx={{ marginRight: theme.spacing(5), width: theme.spacing(150), marginBottom: theme.spacing(5) }} minRows={10}
            multiline
            value={lensData}
            onChange={(e) => { setLensData(e.target.value) }} />
        </Grid>
        <Grid display="flex">
          <Grid display="flex">
            <Typography sx={{ paddingTop: "20px", paddingRight: "10px" }}>Start Date:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DesktopDatePicker
                label="Date"
                inputFormat="YYYY-MM-DD"
                value={start}
                onChange={(newValue) => {
                  setStart(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid display="flex">
            <Typography sx={{ paddingTop: "20px", paddingRight: "10px", paddingLeft: "30px" }}>End Date:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date"
                inputFormat="YYYY-MM-DD"
                value={end}
                onChange={(newValue) => {
                  setEnd(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button variant="contained" onClick={async () => {
              if (start !== null || end !== null) {
                setStart(null);
                setEnd(null);
              }
            }} sx={{ marginLeft: theme.spacing(10), marginTop: theme.spacing(0),marginBottom:theme.spacing(2) }}>Clear</Button>
            <Button
              onClick={async () => {
                setLoading(true);
                if (start === null && end === null) {
                  result = await AnalyticService.discoverLens(lensData);
                }
                else {
                  result = await AnalyticService.timeSeries(lensData, start, end);
                }
                setData(result);
                setFlag(1);
              }}
              variant="contained"
              sx={{ marginLeft: theme.spacing(25), marginTop: theme.spacing(0),marginBottom:theme.spacing(2)}}
            >
              {BUTTON_LABELS.RUN}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        {(!loading && data.length === 0) && <Typography>No results</Typography>}
        {!loading && <LensTable tableRowData={data} flag={flag} />}
        {loading && "Searching"}
      </Grid>
    </Grid>
  );
}
