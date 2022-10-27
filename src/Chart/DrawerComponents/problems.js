import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { ReferenceDataService } from "../../services/P360/referenceDataService";
import { ProblemService } from "../../services/P360/problemService";
export const PatientProblems = ({
  patientId,
  disabled,
  onCancelClick,
  updateProblems,
}) => {
  const [problemPayload, setProblemPayload] = useState({
    data: {
      resourceType: "Condition",
      text: {
        status: "generated",
        div: "Treacher Collins syndrome",
      },
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
      onsetDateTime: "2022-09-16",
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
    const createdProblemData = await ProblemService.getProblemById(
      createdProblem?.data?.id
    );
    updateProblems({ resource: { ...createdProblemData } });
    onCancelClick();
  };

  useEffect(() => {
    Promise.all([initialiseProblemOptions()]);
  }, []);

  return (
    <Grid container direction="column" pt={2}>
      <Grid item container pt={2}>
        <Grid item>
          <Typography variant="h4">
            {disabled ? `Problem Details ` : `Create problem`}
          </Typography>
        </Grid>
      </Grid>
      <Grid item pt={2}>
        <Typography pb={1}> ICD10-Code</Typography>
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
              return `${option?.code} (${option?.display})`;
            }}
            isOptionEqualToValue={(option, value) => {
              return false;
            }}
            onChange={(e, v) => {
              if (v && v !== "" && v !== null) {
                setProblemPayload({
                  data: {
                    ...problemPayload?.data,
                    code: {
                      coding: [
                        {
                          system: "ICD10",
                          code: v?.code,
                        },
                      ],
                    },
                  },
                });
              }
            }}
            isOptionEqualToValue={(option, value) => {
              return option?.code !== value?.display;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ICD10-code"
                onChange={(ev) => {
                  if (ev.target.value !== "" || ev.target.value !== null) {
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
        <Typography pb={1}> Reason for visit</Typography>
        {!disabled && (
          <TextField
            sx={{ width: "100%" }}
            label={"reason"}
            onChange={(e) => {
              if (e.target.value && e.target.value !== null)
                setProblemPayload({
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
      <Grid
        container
        item
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          width: "60%",
          paddingTop: 12,
        }}
        justifyContent={"space-between"}
      >
        <Button
          onClick={() => {
            createProblem(problemPayload);
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
