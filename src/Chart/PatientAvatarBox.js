import {
  Grid,
  Avatar,
  Button,
  Divider,
  Box,
  IconButton,
  Drawer,
  Typography,
  Tooltip,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/system";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useState } from "react";
import CreateAppointment from "./CreateAppointment";
import { Helper } from "../core-utils/helper";
import DoctorImage from "../../src/assets/unsplash_VeF3uWcH4L4.svg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Elation from "../../src/static/E-Favicon-150x150.png"
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DetailsTab from "./TabComponents/DetailsTab";
import NorthEastIcon from '@mui/icons-material/NorthEast';
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
    <Grid container maxWidth={theme.spacing(50)} sx={{ height: "100%" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid sx={{ padding: theme.spacing(1) }} item lg={3}>
            <Avatar
              src={DoctorImage}
              sx={{ height: 50, width: 50, marginRight: theme.spacing(1) }}
            />
          </Grid>

          <Grid item sx={{ padding: theme.spacing(1) }} lg = {7}>
            {patientDetails?.extension?.find((ext) => {
              return ext?.url?.endsWith("deleted-date");
            }) && (
              <Grid color={"black"}>
                <Chip label="DELETED" />
              </Grid>
            )}
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
          <Grid sx={{ padding: theme.spacing(1) }} item lg={1}>
          <Tooltip title="View in EHR" >

            <IconButton onClick = {() => {window.open(`https://sandbox.elationemr.com/patient/${patientDetails?.id}/req-action/`)}}>
            <img src={Elation} style = {{height : "24px", width : "24px"}}/>

            </IconButton>
            </Tooltip>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <DetailsTab patientDetails={patientDetails}></DetailsTab>
        </AccordionDetails>
      </Accordion>
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

      <Grid item sx={{ width: theme.spacing(50) }} alignItems="center">
        <Paper style={{ height: "100%", marginTop: theme.spacing(3) }}>
          <Grid container sx={{ padding: theme.spacing(2) }}>
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
              <AddCircleOutlineRoundedIcon sx={{ color: "black", mr: -12 }} />
            </IconButton>
          </Grid>
          <Grid
            flexDirection="column"
            container
            fontSize={theme.spacing(1.8)}
            color="#84818a"
            display="flex"
            sx={{ ...commonGridElements, paddingLeft: theme.spacing(2) }}
          >
            {upcomingAppointments &&
              upcomingAppointments?.map((appointment, index) => {
                const appointmentDateDetailObject =
                  Helper.extractFieldsFromDate(
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
                      {
                        appointment?.resource?.appointmentType?.coding?.[0]
                          ?.code
                      }{" "}
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
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PatientDetailsCard;
