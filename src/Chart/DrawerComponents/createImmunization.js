import { Divider, Grid, Typography } from "@mui/material";
import { Button, TextField, Box } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Autocomplete } from "@mui/material";
import { ReferenceDataService } from "../../services/P360/referenceDataService";
import { ImmunizationService } from "../../services/P360/immunizationService";
import * as moment from "moment-timezone";
import Loading from "../../Patient/Loading";

export default function Immunization({
  onCancelClick,
  handleImmunizationClick,
  patientId,
}) {
  const [loading, setLoading] = useState(false);
  const [vaccine, setVaccine] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [occurenceDate, setOccurenceDate] = useState(null);
  const [vaccineCode, setVaccineCode] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);
  const formatDate = (value) => {
    let dateObject = new Date(value);
    dateObject = moment
      .tz(
        `${dateObject.getFullYear()}-${
          dateObject.getMonth() <= 8
            ? `0${dateObject.getMonth() + 1}`
            : dateObject.getMonth() + 1
        }-${
          dateObject.getDate() <= 9
            ? `0${dateObject.getDate()}`
            : `${dateObject.getDate()}`
        }T${
          dateObject.getHours() <= 9
            ? `0${dateObject.getHours()}`
            : `${dateObject.getHours()}`
        }:${
          dateObject.getMinutes() <= 9
            ? `0${dateObject.getMinutes()}`
            : `${dateObject.getMinutes()}`
        }:${dateObject.getSeconds()}Z`,
        `YYYY-MM-DDTHH:mm:ss`,
        localStorage.getItem(`DEPARTMENT_TIMEZONE`)
      )
      .utc()
      .format();
    if (localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`) {
      return `${dateObject}`;
    }

    return `${dateObject?.split("T")[0]}`;
  };
  const createImmunizationClick = async () => {
    if (!vaccine) {
      alert("Please provide vaccine");
    } else if (
      localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION` &&
      !quantity
    ) {
      alert("Please provide quantity");
    } else if (!occurenceDate) {
      alert("Please provide occurance date");
    } else {
      let immunizationPayload = {
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: {
          resourceType: "Immunization",
          occurrenceDateTime: formatDate(occurenceDate),
          vaccineCode: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/cvx",
                code: vaccineCode,
                display: vaccine,
              },
            ],
          },
          patient: {
            reference: `Patient/${patientId}`,
          },
          performer: [
            {
              actor: {
                reference: "Practitioner/140857915539458",
              },
              function: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0443",
                    code: "AP",
                  },
                ],
              },
            },
            {
              actor: {
                reference: "Organization/140857911017476",
              },
            },
            {
              actor: {
                reference: "Practitioner/140857915539458",
              },
              function: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0443",
                    code: "OP",
                  },
                ],
              },
            },
          ],
          manufacturer: {
            display: manufacturer,
          },
          doseQuantity: {
            value: quantity,
            unit: "ml",
          },
        },
      };
      const createdImmunization = await ImmunizationService.createImmunization(
        immunizationPayload
      );
      handleImmunizationClick();
    }
  };

  const [vaccineOptions, setVaccineOptions] = useState([]);
  const updateVaccineOptions = async (searchTerm) => {
    const result = await ReferenceDataService.getVaccineData(searchTerm);
    setVaccineOptions(result);
  };
  const initialiseVaccineOptions = async () => {
    const result = await ReferenceDataService.getVaccineData();
    setVaccineOptions(result);
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([initialiseVaccineOptions()])
      .then()
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <Grid container direction="column" pt={2}>
      {loading && <Loading />}
      {!loading && (
        <React.Fragment>
          <Grid>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              Add Patient Immunization
            </Typography>
          </Grid>
          <Divider></Divider>
          <Grid display="flex">
            <Typography
              sx={{
                marginTop: "13px",
                marginRight: "31px",
                marginBottom: "30px",
              }}
            >
              Vaccine:
            </Typography>
            <Autocomplete
              sx={{ width: "100%" }}
              id="combo-box-demo"
              options={vaccineOptions}
              getOptionLabel={(option) => {
                return `${option?.STR} (${option?.CODE}) (${option?.MANUFACTURER})`;
              }}
              onChange={(e, v) => {
                if (v && v !== "" && v !== null) {
                  setVaccine(v.STR);
                  setVaccineCode(v.CODE);
                  setManufacturer(v.MANUFACTURER);
                }
              }}
              renderInput={(params) => (
                <TextField
                  sx={{ width: "100%" }}
                  {...params}
                  label="Vaccine"
                  onChange={(ev) => {
                    if (
                      ev.target.value !== "" &&
                      ev.target.value !== null &&
                      ev?.target?.value?.length > 1
                    ) {
                      updateVaccineOptions(ev.target.value);
                    }
                    // onAllergyChange(ev.target.value);
                  }}
                />
              )}
            />
          </Grid>
          {localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION` && (
            <Grid display="flex" sx={{ paddingBottom: "20px" }}>
              <Typography sx={{ marginTop: "13px", marginRight: "17px" }}>
                Quantity:
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                label={"Dose Quantity..."}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </Grid>
          )}

          <Grid display="flex">
            <Typography sx={{ paddingTop: "20px" }}>Occurence Date:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date"
                inputFormat="YYYY-MM-DD"
                value={occurenceDate}
                onChange={(newValue) => {
                  setOccurenceDate(newValue);
                }}
                // onChange={(e)=>{onDateChange(e.target.value)}}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              padding: "8px 0px 8px 0px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                createImmunizationClick();
              }}
              sx={{ marginRight: "10px" }}
            >
              Create Immunization
            </Button>
            <Button onClick={onCancelClick} variant="contained">
              Cancel
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Grid>
  );
}
