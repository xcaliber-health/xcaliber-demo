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
import { MedicationOrderService } from "../../services/P360/medicationOrderService";
export const CreateMedicationOrder = ({
  patientId,
  disabled,
  onCancelClick,
  onMedicationClick,
  bookedNote,
}) => {
  const [medicationOptionsOpen, setMedicationOptionsOpen] = useState(false);
  const [medicationReasonOptionsOpen, setmedicationReasonOptionsOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [medicationOptions, setMedicationOptions] = useState([]);
  const [medicationReason, setMedicationReason] = useState(null);
  const [medication, setMedication] = useState(null);

  const updateOptions = async (searchTerm) => {
    if (
      localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" &&
      searchTerm.length >= 2
    ) {
      const result = await ReferenceDataService.getMedicationOrderData(
        searchTerm
      );
      setMedicationOptions(result);
    }
  };
  const initialiseMedicationOptions = async () => {
    let result;
    if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      result = await ReferenceDataService.getMedicationOrderData("ab");

      setMedicationOptions(result);
    }
  };
  const [reasonOptions, setreasonOptions] = useState([]);
  const initialisereasonOptions = async () => {
    if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      const result = await ReferenceDataService.getProblemData("ab");
      setreasonOptions(result);
    }
  };

  const updateReasonOptions = async (searchTerm) => {
    if (
      localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" &&
      searchTerm.length >= 2
    ) {
      const result = await ReferenceDataService.getProblemData(searchTerm);
      setreasonOptions(result);
    }
  };
  const CreateMedication = async () => {
    if (medication !== null && medicationReason !== null) {
      if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
        let medicationPayLoad = {
          context: {
            departmentId: localStorage.getItem(`DEPARTMENT_ID`),
          },
          data: {
            resourceType: "MedicationRequest",
            subject: {
              reference: `Patient/${patientId}`,
            },
            encounter: {},
            medicationCodeableConcept: {
              coding: [
                {
                  system: "ATHENA",
                  code: medication,
                },
              ],
            },
            reasonCode: [
              {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: medicationReason,
                  },
                ],
              },
            ],
            requester: {
              reference: "Practitioner/89",
            },
            performer: {
              reference: "Organization/10805303",
            },
          },
        };
        const response = await MedicationOrderService.createMedicationOrder(
          medicationPayLoad,
          bookedNote?.[0]?.resource?.id,
          patientId,
          medicationReason
        );
        onMedicationClick();
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([initialiseMedicationOptions(), initialisereasonOptions()])
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
          <Grid item container pt={2}>
            <Grid item>
              <Typography variant="h4">Create Medication Order</Typography>
            </Grid>
          </Grid>
          <Grid item pt={2}>
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
                    return `${option?.name} ${option?.ordertypeid}`;
                }}
                onChange={(e, v) => {
                  if (v && v !== "" && v !== null) {
                    if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
                      setMedication(v?.ordertypeid);
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

          {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
            <Grid>
              <Grid item pt={2}>
                {!disabled && (
                  <Autocomplete
                    open={medicationReasonOptionsOpen}
                    onOpen={() => {
                      setmedicationReasonOptionsOpen(true);
                    }}
                    onClose={() => {
                      setmedicationReasonOptionsOpen(false);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={reasonOptions}
                    getOptionLabel={(option) => {
                      if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA")
                        return `${option?.SNOMED_CID} (${option?.SNOMED_FSN})`;
                    }}
                    onChange={(e, v) => {
                      if (v && v !== "" && v !== null) {
                        setMedicationReason(v?.SNOMED_CID);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Medication Reason"
                        onChange={(ev) => {
                          if (
                            ev.target.value !== "" ||
                            ev.target.value !== null
                          ) {
                            updateReasonOptions(ev.target.value);
                          }
                        }}
                      />
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
