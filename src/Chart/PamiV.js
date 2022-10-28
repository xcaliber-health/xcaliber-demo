import React, { useEffect, useState } from "react";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import {
  Dangerous,
  ReportProblem,
  DeviceThermostat,
  Medication,
  Vaccines,
} from "@mui/icons-material/";
import {
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useTheme } from "@mui/system";
import { Helper } from "../core-utils/helper";
import { PatientProblems } from "./DrawerComponents/problems";

export default function PamiV({
  patientId,
  problemsList,
  allergyList,
  medicationList,
  immunizationList,
  vitalsList,
  updateProblem,
}) {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState(0);
  const commonGridElements = {
    pt: theme.spacing(0.5),
    pb: 0,
    fontSize: "14px",
  };
  const onCancelClick = () => {
    setIsDrawerOpen(false);
  };

  const onScheduleClick = () => {
    setIsDrawerOpen(false);
  };
  return (
    <React.Fragment>
      <Drawer
        anchor={"right"}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        variant="temporary"
        PaperProps={{
          sx: {
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "10px",
            height: "100%",
            overflowY: "scroll",
            position: "absolute",
            zIndex: 1500,
          },
        }}
      >
        {currentDrawerIndex === 1 && (
          <PatientProblems
            onCancelClick={onCancelClick}
            patientId={patientId}
            updateProblems={updateProblem}
          />
        )}
      </Drawer>

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
                {problem?.resource?.text?.div}
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
