import React, { useEffect } from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import {
  Dangerous,
  ReportProblem,
  DeviceThermostat,
  Medication,
  Vaccines,
} from "@mui/icons-material/";
import { Grid, Box, Tabs, Tab, Typography, IconButton } from "@mui/material";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useTheme } from "@mui/system";
import { Helper } from "../core-utils/helper";

export default function PamiV({
  problemsList,
  allergyList,
  medicationList,
  immunizationList,
  vitalsList,
}) {
  const theme = useTheme();
  const commonGridElements = {
    pt: theme.spacing(0.5),
    pb: 0,
    fontSize: "14px",
  };

  useEffect(() => {
    console.log(allergyList);
  });

  return (
    <React.Fragment>
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        // marginLeft={theme.spacing(3)}
        // marginRight={theme.spacing(3)}
        marginBottom={theme.spacing(3)}
        marginLeft={theme.spacing(3)}
        marginRight={theme.spacing(3)}
        paddingTop={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DeviceThermostat />
          {BUTTON_LABELS.VITALS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>
      {vitalsList &&
        vitalsList?.map((vital) => {
          let dateObject = Helper.extractFieldsFromDate(
            vital?.resource?.extension?.find((ext) => {
              return ext?.url?.endsWith("observation-document-date");
            })?.valueString
          );
          return (
            <Grid
              sx={{ ...commonGridElements }}
              item
              onClick={() => {
                setIsDrawerOpen(true);
                setAppIndex(index);
              }}
              p={4}
            >
              <span style={{ color: `#84818a` }}>
                {vital?.resource?.code?.coding?.[0]?.display} ,{" "}
              </span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DAY}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.MONTH}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DATE}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.YEAR}</span>
            </Grid>
          );
        })}
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <ReportProblem />
          {BUTTON_LABELS.PROBLEMS}
        </div>
        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>

      {problemsList &&
        problemsList?.map((problem) => {
          let dateObject = Helper.extractFieldsFromDate(
            problem?.resource?.recordedDate
          );
          return (
            <Grid
              sx={{ ...commonGridElements }}
              item
              onClick={() => {
                setIsDrawerOpen(true);
                setAppIndex(index);
              }}
              p={4}
            >
              <span style={{ color: `#84818a` }}>
                {problem?.resource?.code?.coding?.[0]?.system} {"-"}
                {problem?.resource?.code?.coding?.[0]?.code} ,
              </span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DAY}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.MONTH}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DATE}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.YEAR}</span>
            </Grid>
          );
        })}

      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dangerous />
          {BUTTON_LABELS.ALLERGIES}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>
      {allergyList &&
        allergyList?.map((allergy) => {
          let dateObject = Helper.extractFieldsFromDate(
            allergy?.resource?.recordedDate
          );
          return (
            <Grid
              sx={{ ...commonGridElements }}
              item
              onClick={() => {
                setIsDrawerOpen(true);
                setAppIndex(index);
              }}
              p={4}
            >
              <span style={{ color: `#84818a` }}>
                {allergy?.resource?.code?.coding?.[0]?.display} ,{" "}
              </span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DAY}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.MONTH}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DATE}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.YEAR}</span>
            </Grid>
          );
        })}
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Vaccines />
          {BUTTON_LABELS.IMMUNIZATIONS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>
      {immunizationList &&
        immunizationList?.map((immunization) => {
          let dateObject = Helper.extractFieldsFromDate(
            immunization?.resource?.occurrenceDateTime
          );
          return (
            <Grid
              sx={{ ...commonGridElements }}
              item
              onClick={() => {
                setIsDrawerOpen(true);
                setAppIndex(index);
              }}
              p={4}
            >
              <span style={{ color: `#84818a` }}>
                {immunization?.resource?.vaccineCode?.coding?.[0]?.display}{" "}
                {","}
              </span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DAY}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.MONTH}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DATE}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.YEAR}</span>
            </Grid>
          );
        })}
      <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Medication />
          {BUTTON_LABELS.MEDICATIONS}
        </div>

        <IconButton sx={{ p: 0 }} display="flex">
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>
      {medicationList &&
        medicationList?.map((medication) => {
          let dateObject = Helper.extractFieldsFromDate(
            medication?.resource?.effectiveDateTime
          );
          return (
            <Grid
              sx={{ ...commonGridElements }}
              item
              onClick={() => {
                setIsDrawerOpen(true);
                setAppIndex(index);
              }}
              p={4}
            >
              <span style={{ color: `#84818a` }}>
                {
                  medication?.resource?.medicationCodeableConcept?.coding?.[0]
                    ?.display
                }{" "}
                {","}
              </span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DAY}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.MONTH}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.DATE}</span>{" "}
              <span style={{ color: "black" }}>{dateObject?.YEAR}</span>
            </Grid>
          );
        })}
    </React.Fragment>
  );
}
