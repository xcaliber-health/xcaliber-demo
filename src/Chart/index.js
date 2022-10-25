import {
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/system";
import PatientDetailsCard from "./PatientAvatarBox";
import { useParams, useNavigate } from "react-router-dom";
import { PatientService } from "../services/P360/patientService";
import { AppointmentService } from "../services/P360/appointmentService";
import NotesTab from "./TabComponents/NotesTab";
import ComingSoon from "../Watermark/ComingSoon"
import PamiV from "./PamiV";

import CreateAppointment from "./CreateAppointment";

const Chart = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appointmentPayload, setAppointmentPayload] = useState({
    data: {
      resourceType: "Appointment",
      id: 141000308031578,
      start: "",
      minutesDuration: 15,
      appointmentType: {
        coding: [
          {
            system: "https://hl7.org/fhir/v2/ValueSet/appointment-type",
            code: "",
            display: "",
          },
        ],
      },
      participant: [
        {
          actor: {
            reference: "Practitioner/140857915539458",
          },
        },
        {
          actor: {
            reference: "HealthcareService/140857911017476",
          },
        },
      ],
    },
  });

  const getPatientDetails = async () => {
    const response = await PatientService.getPatientById(id);
    setPatientDetails(response);
  };
  const [value, setValue] = React.useState(0);

  const getUpcomingAppointments = async () => {
    const response = await AppointmentService.getUpcomingAppointments(
      id,
      new Date().toISOString().slice(0, 10)
    );
    setUpcomingAppointments(response);
  };
  const onReasonChange = (reason) => {
    setAppointmentPayload({
      data: {
        ...appointmentPayload?.data,
        appointmentType: {
          coding: [
            {
              system: "https://hl7.org/fhir/v2/ValueSet/appointment-type",
              code: reason,
              display: reason,
            },
          ],
        },
      },
    });
  };
  const onDateChange = (startDate) => {
    setAppointmentPayload({
      data: {
        ...appointmentPayload?.data,
        start: startDate,
      },
    });
  };
  const onTimeChange = (time) => {
    let finalDateValue = appointmentPayload?.data?.start?.slice(0, 10);
    setAppointmentPayload({
      data: {
        ...appointmentPayload?.data,
        start: `${finalDateValue}${time}`,
      },
    });
  };
  const updatePatientId = (patientId) => {
    setAppointmentPayload({
      data: {
        ...appointmentPayload?.data,
        participant: [
          {
            actor: {
              reference: `Patient/${patientId}`,
            },
          },
          ...appointmentPayload?.data?.participant,
        ],
      },
    });
  };
  const onScheduleClick = async (appointmentPayload, patientId) => {
    const keyArray = Object.keys(appointmentPayload?.data);
    if (
      !keyArray?.includes("start") ||
      appointmentPayload?.data?.start === null ||
      appointmentPayload?.data?.start?.trim() === ""
    ) {
      alert("Please provide a valid start date and time");
    }
    if (
      !keyArray?.includes("appointmentType") ||
      appointmentPayload?.data?.coding === null ||
      appointmentPayload?.data?.coding?.[0]?.display?.trim() === ""
    ) {
      alert("Please provide a valid reason ");
    } else {
      await AppointmentService.createAppointment(appointmentPayload);
      setIsDrawerOpen(false);
      navigate(`/p360/${id}`);
    }
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([getPatientDetails(), getUpcomingAppointments()])
      .then()
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid
      container
      spacing={1}
      justifyContent="space-between"
      style={{ marginTop: 0 }}
    >
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
        <CreateAppointment
          patientDetails={patientDetails}
          appointmentFormDetails={appointmentPayload}
          setAppointmentPayload={setAppointmentPayload}
          onScheduleClick={onScheduleClick}
          onReasonChange={onReasonChange}
          onCancelClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          updatePatientId={updatePatientId}
        />
      </Drawer>
      <Grid
        sx={{
          backgroundColor: "#FAF9F6",
          width: theme.spacing(50),
          height: theme.spacing(60),
        }}
        lg={3}
      >
        {!loading && (
          <PatientDetailsCard
            patientId={id}
            patientDetails={patientDetails}
            upcomingAppointments={upcomingAppointments}
            drawerState={isDrawerOpen}
            handleDrawerState={setIsDrawerOpen}
          />
        )}
        {loading && "Loading"}
      </Grid>

      <Grid
        sx={{
          backgroundColor: "#FAF9F6",
          // width: theme.spacing(50),
          height: theme.spacing(60),
        }}
        lg={5}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Timeline" />
            <Tab label="Notes" />
            <Tab label="Details" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ComingSoon/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <NotesTab patientDetails={patientDetails} />
        </TabPanel>
        <TabPanel value={value} index={2}>
        <ComingSoon/>
        </TabPanel>
      </Grid>

      <Grid
        sx={{
          backgroundColor: "#FAF9F6",
          // width: theme.spacing(50),
          height: theme.spacing(60),
        }}
        lg={3}
      >
        <PamiV />
      </Grid>
    </Grid>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
export default Chart;
