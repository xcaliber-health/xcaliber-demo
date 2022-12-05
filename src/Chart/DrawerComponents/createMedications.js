import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { ReferenceDataService } from "../../services/P360/referenceDataService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Loading from "../../Patient/Loading";
import { MedicationService } from "../../services/P360/medicationService";
export const CreateMedication = ({
  patientId,
  disabled,
  onCancelClick,
  onMedicationClick,
}) => {
  const [medicationOptionsOpen, setMedicationOptionsOpen] = useState(false);
  const [
    medicationStopReasonsOptionsOpen,
    setMedicationStopReasonsOptionsOpen,
  ] = useState(false);
  const [loading, setLoading] = useState(false);

  const [medicationOptions, setMedicationOptions] = useState([]);
  const [medicationStopReason, setMedicationStopReason] = useState(null);
  const [medication, setMedication] = useState(null);

  const updateOptions = async (searchTerm) => {
    if (
      localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" &&
      searchTerm.length >= 2
    ) {
      const result = await ReferenceDataService.getMedicationData(searchTerm);
      setMedicationOptions(result);
    }
  };
  const initialiseMedicationOptions = async () => {
    let result;
    if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      result = await ReferenceDataService.getMedicationData("ab");

      setMedicationOptions(result);
    }
  };
  const [stopReasonOptions, setStopReasonOptions] = useState([]);
  const initialiseStopreasonOptions = async () => {
    if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      const result = await ReferenceDataService.getMedicationStopReasonsData();
      setStopReasonOptions(result);
    }
  };
  const formatDate = (value) => {
    let dateObject = new Date(
      new Date(value).toLocaleString(`en-US`, {
        timeZone: localStorage.getItem(`DEPARTMENT_TIMEZONE`),
      })
    );
    return `${dateObject.getFullYear()}-${
      dateObject.getMonth() + 1
    }-${dateObject.getDate()}`;
  };
  const CreateMedication = async () => {
    if (medication !== null) {
      if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
        let medicationPayLoad = {
          context: {
            departmentId: localStorage.getItem(`DEPARTMENT_ID`),
          },
          data: {
            resourceType: "MedicationStatement",
            subject: {
              reference: `Patient/${patientId}`,
            },
            medicationReference: {
              reference: `Medication/${medication}`,
            },
            effectivePeriod: {
              start: formatDate(startDate),
              end: formatDate(stopDate),
            },
            statusReason: [
              {
                coding: [
                  {
                    display: medicationStopReason,
                  },
                ],
              },
            ],
          },
        };
        const response = await MedicationService.createMedicationInAthena(
          medicationPayLoad
        );
        onMedicationClick();
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([initialiseMedicationOptions(), initialiseStopreasonOptions()])
      .then()
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const [startDate, setStartDate] = useState(null);
  const [stopDate, setStopDate] = useState(null);
  return (
    <Grid container direction="column" pt={2}>
      {loading && <Loading />}
      {!loading && (
        <React.Fragment>
          <Grid item container pt={2}>
            <Grid item>
              <Typography variant="h4">Create Medication</Typography>
            </Grid>
          </Grid>
          <Grid item pt={2}>
            <Typography pb={1}> Medication</Typography>
            {!disabled && (
              <Autocomplete
                open={medicationOptionsOpen}
                onOpen={() => {
                  setMedicationOptionsOpen(true);
                }}
                onClose={() => {
                  setMedicationOptionsOpen(false);
                }}
                disablePortal
                id="combo-box-demo"
                options={medicationOptions}
                getOptionLabel={(option) => {
                  if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA")
                    return `${option?.medication} ${option?.medicationid}`;
                }}
                onChange={(e, v) => {
                  if (v && v !== "" && v !== null) {
                    if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
                      setMedication(v?.medicationid);
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Medication"
                    onChange={(ev) => {
                      if (ev.target.value !== "" || ev.target.value !== null) {
                        updateOptions(ev.target.value);
                      }
                    }}
                  />
                )}
              />
            )}
          </Grid>

          <Grid item container display="flex" pt={2} spacing={2}>
            <Grid item>
              <Typography sx={{ paddingTop: "20px" }}>Start Date:</Typography>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="YYYY-MM-DD"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  // onChange={(e)=>{onDateChange(e.target.value)}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
            <Grid>
              <Grid item container display="flex" pt={2} spacing={2}>
                <Grid item>
                  <Typography sx={{ paddingTop: "20px" }}>
                    Stop Date:
                  </Typography>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Date"
                      inputFormat="YYYY-MM-DD"
                      value={stopDate}
                      onChange={(newValue) => {
                        setStopDate(newValue);
                      }}
                      // onChange={(e)=>{onDateChange(e.target.value)}}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid item pt={2}>
                {!disabled && (
                  <Autocomplete
                    open={medicationStopReasonsOptionsOpen}
                    onOpen={() => {
                      setMedicationStopReasonsOptionsOpen(true);
                    }}
                    onClose={() => {
                      setMedicationStopReasonsOptionsOpen(false);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={stopReasonOptions}
                    getOptionLabel={(option) => {
                      if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA")
                        return option?.stopreason;
                    }}
                    onChange={(e, v) => {
                      if (v && v !== "" && v !== null) {
                        setMedicationStopReason(v?.stopreason);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Medication Stop reason" />
                    )}
                  />
                )}
              </Grid>
            </Grid>
          )}

          <Box
            sx={{
              display: "flex",
              width: "100%",
              padding: "8px 0px 8px 0px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                CreateMedication();
              }}
              disabled={disabled}
              variant="contained"
              sx={{ marginRight: "10px" }}
            >
              Create
            </Button>
            <Button onClick={onCancelClick} variant="contained">
              Cancel
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Grid>
  );
};
