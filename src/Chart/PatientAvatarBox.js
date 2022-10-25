import { Grid, Avatar, Button, Divider, Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/system";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { BUTTON_LABELS } from "../core-utils/constants";
import { useEffect } from "react";
import { Helper } from "../core-utils/helper";

const PatientDetailsCard = ({
  patientDetails,
  upcomingAppointments,
  drawerState,
  handleDrawerState,
}) => {
  const theme = useTheme();
  const commonGridElements = { pt: theme.spacing(1.5), pb: theme.spacing(1.5) };

  return (
    <Grid container minWidth={theme.spacing(25)} sx={{ pt: theme.spacing(1) }}>
      <Grid sx={{ padding: theme.spacing(1) }} item>
        <Avatar sx={{ height: 50, width: 50, marginRight: theme.spacing(1) }} />
      </Grid>
      <Grid item sx={{ padding: theme.spacing(1) }}>
        <Grid>{`${patientDetails?.name?.[0]?.given?.[0]}  ${patientDetails?.name?.[0]?.family} `}</Grid>
        <Grid>
          {`Patient | ${20} | ${patientDetails?.extension?.find((extension) => {
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
        <Box
          alignSelf="flex-start"
          display="flex"
          justifyContent="space-between"
        >
          <EventAvailableIcon />
          {BUTTON_LABELS.UPCOMING_APPOINTMENTS}
          <IconButton
            sx={{ p: 0 }}
            display="flex"
            onClick={() => {
              handleDrawerState(!drawerState);
            }}
          >
            <AddCircleOutlineRoundedIcon />
          </IconButton>
        </Box>
        <Grid
          flexDirection="column"
          container
          fontSize={theme.spacing(1.8)}
          color="#84818a"
          display="flex"
          sx={{ ...commonGridElements }}
        >
          {upcomingAppointments &&
            upcomingAppointments?.map((appointment) => {
              const appointmentDateDetailObject = Helper.extractFieldsFromDate(
                appointment?.resource?.start?.slice(0, 10)
              );
              return (
                <Grid sx={{ ...commonGridElements }} item>
                  <span> {appointmentDateDetailObject?.DAY} </span>
                  <span> {appointmentDateDetailObject?.MONTH} </span>
                  <span> {appointmentDateDetailObject?.DATE} </span>
                  <span> {appointmentDateDetailObject?.YEAR} </span>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientDetailsCard;
