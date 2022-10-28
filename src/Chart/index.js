import { Grid, Box, Tabs, Tab, Typography, Drawer, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/system";
import PatientDetailsCard from "./PatientAvatarBox";
import { useParams, useNavigate } from "react-router-dom";
import { PatientService } from "../services/P360/patientService";
import { AppointmentService } from "../services/P360/appointmentService";
import NotesTab from "./TabComponents/NotesTab";
import ComingSoon from "../Watermark/ComingSoon";
import PamiV from "./PamiV";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

import {
  Dangerous,
  ReportProblem,
  DeviceThermostat,
  Medication,
  Vaccines,
} from "@mui/icons-material/";
import {
  IconButton
} from "@mui/material";
import { PatientProblems } from "./DrawerComponents/problems";
import { BUTTON_LABELS } from "../core-utils/constants";
import CreateAppointment from "./CreateAppointment";
import Loading from "../Patient/Loading";
import { VitalService } from "../services/P360/vitalService";
import { ProblemService } from "../services/P360/problemService";
import { AllergyService } from "../services/P360/allergyService";
import { MedicationService } from "../services/P360/medicationService";
import { ImmunizationService } from "../services/P360/immunizationService";

const Chart = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patientVitals, setPatientVitals] = useState([]);
  const [patientProblems, setPatientProblems] = useState([]);
  const [patientAllergies, setPatientAllergies] = useState([]);
  const [patientImmunizations, setPatientImmunizations] = useState([]);
  const [patientMedications, setPatientMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProblemsDrawerOpen, setIsProblemsDrawerOpen] = useState(false);
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

  useEffect(() => {
    console.log(patientProblems);
  });

  const updateProblemsState = (createdProblemData) => {
    setPatientProblems([...patientProblems, createdProblemData]);
  };

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

  const getProblems = async () => {
    const response = await ProblemService.getProblems(id);
    setPatientProblems(response);
  };

  const getAllergies = async () => {
    const response = await AllergyService.getAllergies(id);
    setPatientAllergies(response);
  };

  const getMedications = async () => {
    const response = await MedicationService.getMedications(id);
    setPatientMedications(response);
  };

  const getImmunizations = async () => {
    const response = await ImmunizationService.getImmunization(id);
    setPatientImmunizations(response);
  };

  const getVitals = async () => {
    const response = await VitalService.getVitals(id);
    setPatientVitals(response);
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
      const response = await AppointmentService.createAppointment(
        appointmentPayload
      );
      const createdAppointment = await AppointmentService.getAppointmentById(
        response
      );
      setUpcomingAppointments([
        ...upcomingAppointments,
        { resource: { ...createdAppointment } },
      ]);
      setIsDrawerOpen(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPatientDetails(),
      getUpcomingAppointments(),
      getProblems(),
      getAllergies(),
      getMedications(),
      getImmunizations(),
      getVitals(),
    ])
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
      <Drawer
        anchor={"right"}
        open={isProblemsDrawerOpen}
        onClose={() => {
          setIsProblemsDrawerOpen(false);
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
        <PatientProblems
            disabled = {false}
            onCancelClick = {() => {setIsProblemsDrawerOpen(false)}}
          patientId={id}
        />
      </Drawer>
      <Grid
        sx={{
          width: theme.spacing(50),
          height: "100%",
        }}
        lg={4}
      >
        {/* <Paper style={{ height: "100%" ,marginBottom:"20px"}}> */}
          {!loading && (
            <PatientDetailsCard
              patientId={id}
              patientDetails={patientDetails}
              upcomingAppointments={upcomingAppointments}
              drawerState={isDrawerOpen}
              handleDrawerState={setIsDrawerOpen}
            />
          )}
          {loading && <Loading />}
        {/* </Paper> */}
        <Paper>
         
        </Paper>
      </Grid>

      <Grid
        sx={{
          // width: theme.spacing(50),
          height: theme.spacing(60),
        }}
        lg={8}
      >
        <Paper style={{ height: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
              value={value}
              onChange={handleChange}
              // width="60%"
              centered
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Notes" style={{ width: "25%" }} />
              <Tab label="Vitals" style={{ width: "25%" }} />
              <Tab label="Problems" style={{ width: "25%" }} />
              <Tab label="Allergies" style={{ width: "25%" }} />
              <Tab label="Immunizations" style={{ width: "25%" }} />
              <Tab label="Medications" style={{ width: "25%" }} />
              {/* <Tab label="Profile" style={{ width: "25%" }} /> */}
            </Tabs>
          </Box>
          <TabPanel value={value} index={1}>
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
              <div style={{ display: "flex", alignItems: "center", }}>
                <DeviceThermostat />
                {BUTTON_LABELS.VITALS}
              </div>

              <IconButton sx={{ p: 0 }} display="flex">
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </Box>
            <PamiV vitalsList={patientVitals} patientId={id} />
          </TabPanel>
          <TabPanel value={value} index={0}>
            <NotesTab patientDetails={patientDetails} />
          </TabPanel>
          <TabPanel value={value} index={2}>
          <Box
        alignSelf="flex-start"
        display="flex"
        justifyContent="space-between"
        margin={theme.spacing(3)}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <ReportProblem />
          <Typography>{BUTTON_LABELS.PROBLEMS}</Typography>
        </div>
        <IconButton
          sx={{ p: 0 }}
          display="flex"
          onClick={() => {
            setIsProblemsDrawerOpen(true);
            setCurrentDrawerIndex(1);
          }}
        >
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>
            <PamiV problemsList={patientProblems} updateProblem={updateProblemsState}  patientId={id}/>
          </TabPanel>
          <TabPanel value={value} index={3}>
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
            <PamiV allergyList={patientAllergies}  patientId={id}/>
          </TabPanel>
          <TabPanel value={value} index={4}>
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
            <PamiV immunizationList={patientImmunizations}  patientId={id}/>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <PamiV medicationList={patientMedications} patientId={id} />
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
          </TabPanel>
        </Paper>
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
