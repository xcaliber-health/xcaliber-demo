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
      {
        vitalsList &&
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
