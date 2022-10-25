import {
  Grid,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";

const CreateNotes = ({
  patientDetails,
  noteFormDetails,
  onCreateClick,
  onCancelClick,
  onTemplateChange,
  onDateChange,
  onTimeChange,
  updatePatientId,
  disabled,
}) => {
  const [value, setValue] = useState(null);
  const [templateValue, setTemplateValue] = useState("Simple");
  useEffect(() => {
    if (value) {
      const dateObject = new Date(value);
      onDateChange(
        `${dateObject.getFullYear()}-${
          dateObject.getMonth() + 1
        }-${dateObject.getDate()}T00:00:00Z`
      );
    }
  }, [value]);

  return (
    <Grid container>
      <Grid item pt={2}>
        <Grid item pt={2}>
          <Typography variant="h4">{`Create Notes`}</Typography>
        </Grid>
        <Grid item pt={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Document date"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item pt={2}>
          <RadioGroup
            onChange={(e) => {
              onTimeChange(e.target.value);
            }}
            pt={2}
          >
            <FormControlLabel
              value="T11:00:00Z"
              control={<Radio />}
              label="11:00 AM"
              disabled={value ? false : true}
            />
            <FormControlLabel
              value="T14:00:00Z"
              control={<Radio />}
              label="02:00 PM"
              disabled={value ? false : true}
            />
            <FormControlLabel
              value="T16:00:00Z"
              control={<Radio />}
              label="04:00 PM"
              disabled={value ? false : true}
            />
          </RadioGroup>
        </Grid>
        <Grid
          container
          item
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          <Button
            onClick={() => {
              updatePatientId(patientDetails?.id);
              onCreateClick(noteFormDetails);
            }}
            disabled={disabled}
          >
            Create
          </Button>
          <Button onClick={onCancelClick} disabled={disabled}>
            Cancel
          </Button>
        </Grid>
        <Grid item pt={2}>
          <InputLabel id="notesinput-label-select-label">Template</InputLabel>
          <Select
            id="template-note-select"
            value={templateValue}
            label="Age"
            onChange={(e) => {
              setTemplateValue(e.target.value);
              onTemplateChange(e.target.value);
            }}
          >
            <MenuItem value={`Simple`}>Simple</MenuItem>
            <MenuItem value={`SOAP`}>SOAP</MenuItem>
            <MenuItem value={`Pre-Op`}>Pre-Op</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CreateNotes;
