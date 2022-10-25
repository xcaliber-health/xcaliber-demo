import {
  Grid,
  Avatar,
  Button,
  Divider,
  Box,
  IconButton,
  Drawer,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useState } from "react";
import CreateAppointment from "./CreateAppointment";
import { Helper } from "../core-utils/helper";

const PatientDetailsCard = ({
  patientDetails,
  upcomingAppointments,
  drawerState,
  handleDrawerState,
}) => {
  const theme = useTheme();
  const commonGridElements = { pt: theme.spacing(1.5), pb: theme.spacing(1.5) };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appIndex, setAppIndex] = useState(null);

  const calculateAge = (birthYear) => {
    let currentYear = new Date().getFullYear();
    return `${currentYear - birthYear}`;
  };

  return (
    <Grid container minWidth={theme.spacing(25)} sx={{ pt: theme.spacing(1) }}>
      <Grid sx={{ padding: theme.spacing(1) }} item>
        <Avatar sx={{ height: 50, width: 50, marginRight: theme.spacing(1) }} />
      </Grid>
      <Drawer
        anchor={"right"}
        open={isDrawerOpen}
        variant="temporary"
        onClose={() => {
          setIsDrawerOpen(false);
        }}
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
        <CreateAppointment
          patientDetails={null}
          appointmentFormDetails={upcomingAppointments?.[appIndex]}
          setAppointmentPayload={() => {}}
          onScheduleClick={() => {}}
          onReasonChange={() => {}}
          onCancelClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          onDateChange={() => {}}
          onTimeChange={() => {}}
          updatePatientId={() => {}}
          disabled={true}
        />
      </Drawer>
      <Grid item>
        <Grid>{`${patientDetails?.name?.[0]?.given?.[0]}  ${patientDetails?.name?.[0]?.family} `}</Grid>
        <Grid>
          {`Patient | ${calculateAge(
            parseInt(patientDetails?.birthDate?.slice(0, 4))
          )} | ${
            patientDetails?.extension?.find((extension) => {
              return (
                extension?.url ===
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex"
              );
            })?.valueCode
          }`}
        </Grid>

        {/* TODO : Edit profile button 
         <Grid>
          <Button size="small" variant="contained">
            {BUTTON_LABELS.EDIT_PROFILE}
          </Button>
        </Grid> 
        */}
      </Grid>
      <Divider
        sx={{
          pb: theme.spacing(1),
          pt: theme.spacing(1),
          pl: "none",
          width: "100%",
        }}
      />
      <Grid
        item
        sx={{ p: theme.spacing(3), width: theme.spacing(42) }}
        alignItems="center"
      >
        <Grid container>
          <EventAvailableIcon />
          <Typography
            sx={{
              fontSize: theme.spacing(1.8),
              ml: theme.spacing(0.5),
              mr: theme.spacing(0.5),
            }}
          >
            {BUTTON_LABELS.UPCOMING_APPOINTMENTS}
          </Typography>
          <IconButton
            sx={{ p: 0 }}
            display="flex"
            onClick={() => {
              handleDrawerState(!drawerState);
            }}
          >
            <AddCircleOutlineRoundedIcon />
          </IconButton>
        </Grid>
        <Grid
          flexDirection="column"
          container
          fontSize={theme.spacing(1.8)}
          color="#84818a"
          display="flex"
          sx={{ ...commonGridElements }}
        >
          {upcomingAppointments &&
            upcomingAppointments?.map((appointment, index) => {
              const appointmentDateDetailObject = Helper.extractFieldsFromDate(
                appointment?.resource?.start?.slice(0, 10)
              );
              return (
                <Grid
                  sx={{ ...commonGridElements, cursor: "pointer" }}
                  item
                  onClick={() => {
                    setIsDrawerOpen(true);
                    setAppIndex(index);
                  }}
                >
                  <span>
                    {appointment?.resource?.appointmentType?.coding?.[0]?.code}{" "}
                    ,{" "}
                  </span>{" "}
                  <span style={{ color: "black" }}>
                    {appointmentDateDetailObject?.DAY}
                  </span>{" "}
                  <span style={{ color: "black" }}>
                    {appointmentDateDetailObject?.MONTH}
                  </span>{" "}
                  <span style={{ color: "black" }}>
                    {appointmentDateDetailObject?.DATE}
                  </span>{" "}
                  <span style={{ color: "black" }}>
                    {appointmentDateDetailObject?.YEAR}
                  </span>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientDetailsCard;
