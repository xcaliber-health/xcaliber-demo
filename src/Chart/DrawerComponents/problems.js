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
import { ProblemService } from "../../services/P360/problemService";
import * as moment from "moment-timezone";
import Loading from "../../Patient/Loading";
export const PatientProblems = ({
  patientId,
  disabled,
  onCancelClick,
  updateProblems,
}) => {
  let dateObject = new Date(
    new Date().toLocaleString(`en-US`, {
      timeZone: localStorage.getItem(`DEPARTMENT_TIMEZONE`),
    })
  );
  const [problemPayload, setProblemPayload] = useState({
    context: {
      departmentId: localStorage.getItem(`DEPARTMENT_ID`),
    },
    data: {
      resourceType: "Condition",
      text: {
        status: "generated",
        div: "",
      },
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "problem-list-item",
              display: "Problem List Item",
            },
          ],
        },
      ],
      clinicalStatus: {
        coding: [
          {
            code: "active",
            display: "Active",
          },
        ],
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      note: [
        {
          text: "",
        },
      ],
      onsetDateTime: moment
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
        .format(),
      recordedDate: "2022-09-16T12:27:24Z",
      abatementDateTime: "",
      code: {
        coding: [
          {
            system: "ICD10",
            code: "",
          },
        ],
      },
    },
  });
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const [problemIcd10Options, setProblemIcd10Options] = useState([]);
  const updateOptions = async (searchTerm) => {
    const result = await ReferenceDataService.getProblemData(searchTerm);
    setProblemIcd10Options(result);
  };
  const initialiseProblemOptions = async () => {
    const result = await ReferenceDataService.getProblemData();
    setProblemIcd10Options(result);
  };

  const createProblem = async (problemPayload) => {
    const createdProblem = await ProblemService.createProblem(problemPayload);
    if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
      const createdProblemData = await ProblemService.getProblemById(
        createdProblem?.data?.id
      );
      updateProblems({ resource: { ...createdProblemData } });
      onCancelClick();
    } else if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
      onCancelClick();
      // window.location.reload();
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([initialiseProblemOptions()])
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
              <Typography variant="h4">
                {disabled ? `Problem Details ` : `Create problem`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item pt={2}>
            <Typography pb={1}> Snomed-Code</Typography>
            {!disabled && (
              <Autocomplete
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                disablePortal
                id="combo-box-demo"
                options={problemIcd10Options}
                getOptionLabel={(option) => {
                  if (
                    localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" ||
                    localStorage.getItem("XCALIBER_SOURCE") === "ELATION"
                  )
                    return `${option?.SNOMED_CID} (${option?.SNOMED_FSN})`;
                  else return option?.label;
                }}
                onChange={(e, v) => {
                  if (v && v !== "" && v !== null) {
                    setProblemPayload({
                      context: {
                        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
                      },
                      data: {
                        ...problemPayload?.data,
                        text: {
                          status: "generated",
                          div: v?.SNOMED_FSN,
                        },
                        code: {
                          coding: [
                            {
                              system: `http://snomed.info/sct`,
                              code: v?.SNOMED_CID,
                            },
                          ],
                        },
                      },
                    });
                  }
                }}
                isOptionEqualToValue={(option, value) => {
                  return option?.SNOMED_CID !== option?.SNOMED_FSN;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Snomed-code"
                    onChange={(ev) => {
                      if (
                        ev.target.value !== "" &&
                        ev.target.value !== null &&
                        ev.target.value.length > 2
                      ) {
                        updateOptions(ev.target.value);
                      }
                    }}
                  />
                )}
              />
            )}
            {/* {disabled && (
          <TextField
            sx={{ width: "100%" }}
            label={"reason"}
            value={
              appointmentFormDetails?.resource?.appointmentType?.coding?.[0]
                ?.code
            }
            disabled={true}
          />
        )} */}
          </Grid>
          <Grid item pt={2}>
            <Typography pb={1}>Synopsis</Typography>
            {!disabled && (
              <TextField
                sx={{ width: "100%" }}
                label={"reason"}
                onChange={(e) => {
                  if (e.target.value && e.target.value !== null)
                    setProblemPayload({
                      context: {
                        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
                      },
                      data: {
                        ...problemPayload?.data,
                        note: [
                          {
                            text: e.target?.value,
                          },
                        ],
                      },
                    });
                }}
              />
            )}
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
              onClick={() => {
                createProblem(problemPayload);
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
