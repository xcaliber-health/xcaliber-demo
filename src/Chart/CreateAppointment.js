import {
  Button,
  Grid,
  RadioGroup,
  TextField,
  Typography,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect } from "react";

const CreateAppointment = ({
  patientDetails,
  appointmentFormDetails,
  onScheduleClick,
  onCancelClick,
  onReasonChange,
  onDateChange,
  onTimeChange,
  updatePatientId,
  disabled,
}) => {
  const [value, setValue] = React.useState(null);
  useEffect(() => {
    updatePatientId(patientDetails?.id);
  }, []);
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
    <Grid container direction="column" pt={2}>
      <Grid item container pt={2}>
        <Grid item>
          <Typography variant="h4">
            {disabled ? `Appointment Details ` : `Schedule Appointment`}
          </Typography>
        </Grid>
      </Grid>
      {/* <Grid item pt={2}>
          <TextField
            sx={{ width: "100%" }}
            value={`${patientDetails?.name?.[0]?.given?.[0]}  ${patientDetails?.name?.[0]?.family} `}
            disabled
            required={true}
          />
        </Grid> */}
      <Grid item pt={2}>
        <Typography pb={1}> Reason for visit</Typography>
        {!disabled && (
          <TextField
            sx={{ width: "100%" }}
            label={"reason"}
            onChange={(e) => {
              onReasonChange(e.target.value);
            }}
          />
        )}
        {disabled && (
          <TextField
            sx={{ width: "100%" }}
            label={"reason"}
            value={
              appointmentFormDetails?.resource?.appointmentType?.coding?.[0]
                ?.code
            }
            disabled={true}
          />
        )}
      </Grid>
      {/* <Grid item pt={2}>
          <Typography pb={1}>Select team member (Physician Assistant)</Typography>
          <TextField
            sx={{ width: "100%" }}
            value={"Xcaliber user"}
            required
            disabled
          />
        </Grid> */}
      {/* <Grid item pt={2}>
          <Typography pb={1}> Location Type</Typography>
          <TextField
            sx={{ width: "100%" }}
            value={"Virtual/Telehealth"}
            required
            disabled
          />
        </Grid> */}
      <Grid item pt={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {!disabled && (
            <DatePicker
              label="Appointment date"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
          {disabled && appointmentFormDetails && (
            <DatePicker
              label="Appointment date"
              value={new Date(appointmentFormDetails?.resource?.start)}
              onChange={() => {}}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        </LocalizationProvider>
      </Grid>
      <Grid>
        <RadioGroup
          onChange={(e) => {
            console.log(e.target.value);
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
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          width: "60%",
        }}
        justifyContent={"space-evenly"}
      >
        <Button
          onClick={() => {
            onScheduleClick(appointmentFormDetails, patientDetails?.id);
          }}
          disabled={disabled}
          variant="contained"
        >
          Schedule
        </Button>
        <Button onClick={onCancelClick} disabled={disabled} variant="contained">
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateAppointment;
