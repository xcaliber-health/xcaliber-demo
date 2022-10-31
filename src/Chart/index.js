import {
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  Drawer,
  Paper,
  Button,
} from "@mui/material";
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
import CreateVitals from "./DrawerComponents/CreateVitals";
import {
  Dangerous,
  ReportProblem,
  DeviceThermostat,
  Medication,
  Vaccines,
} from "@mui/icons-material/";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton } from "@mui/material";
import { PatientProblems } from "./DrawerComponents/problems";
import { BUTTON_LABELS } from "../core-utils/constants";
import CreateAppointment from "./CreateAppointment";
import Loading from "../Patient/Loading";
import { VitalService } from "../services/P360/vitalService";
import { ProblemService } from "../services/P360/problemService";
import { AllergyService } from "../services/P360/allergyService";
import { MedicationService } from "../services/P360/medicationService";
import { ImmunizationService } from "../services/P360/immunizationService";
import Allergy from "./DrawerComponents/createAllergies";
import { secondsInWeek } from "date-fns";
import { rangeRight } from "lodash";
import { Helper } from "../core-utils/helper";

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
  const [isVitalsDrawerOpen, setVitalsDrawer] = useState(false);
  const [isAllergyDrawerOpen, setIsAllergyDrawerOpen] = useState(false);
  const [severity, setSeverity] = React.useState(null);
  const handleSeverityChange = (e) => {
    setSeverity(e.target.value);
  };
  const [status, setStatus] = React.useState(null);
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const [valueDate, setValueDate] = React.useState(null);
  const handleDateChange = (newValue) => {
    setValueDate(newValue);
  };
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
  const [allergyPayload, setAllergyPayload] = useState({
    data: {
      resourceType: "AllergyIntolerance",
      clinicalStatus: {
        coding: [
          {
            code: "active",
            display: "Active",
          },
        ],
      },
      identifier: [
        {
          id: "medispanid",
          value: "44364",
        },
        {
          id: "medispandnid",
          value: "12647",
        },
      ],
      patient: {
        reference: `Patient/${id}`,
      },
      onsetDateTime: "2010-07-02",
      recordedDate: "2022-06-28T11:43:22Z",
      text: {
        div: "deletedDate: null",
      },
      reaction: [],
    },
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
    let finalDateValue;
    if (appointmentPayload?.data?.start?.slice(0, 10)?.endsWith("T")) {
      finalDateValue = appointmentPayload?.data?.start?.slice(0, 9);
    } else {
      finalDateValue = appointmentPayload?.data?.start?.slice(0, 10);
    }
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
  const onAllergyChange = (reason) => {
    setAllergyPayload({
      data: {
        ...allergyPayload?.data,
        code: {
          coding: [
            {
              display: reason,
            },
          ],
        },
      },
    });
  };
  const reaction2 = [];
  const reaction = {};
  const onReactionChange = (reaction1) => {
    if (reaction1) {
      reaction["reaction"] = reaction1;
    }
    setAllergyPayload({
      data: {
        ...allergyPayload?.data,
        reaction: reaction,
      },
    });
  };
  const onSeverityChange = (severity) => {
    if (severity) {
      reaction["description"] = severity;
    }
    setAllergyPayload({
      data: {
        ...allergyPayload?.data,
        reaction: reaction,
      },
    });
    setSeverity(severity);
  };
  const onStatusChange = (status) => {
    setAllergyPayload({
      data: {
        ...allergyPayload?.data,
        clinicalStatus: {
          coding: [
            {
              code: status,
              display: status,
            },
          ],
        },
      },
    });
    setStatus(status);
  };
  const onAllergyDateChange = (date) => {
    setAllergyPayload({
      data: {
        ...allergyPayload?.data,
        onsetDateTime: date,
      },
    });
    setValueDate(date);
  };

  const handleAllergyClick = async (allergyPayload) => {
    const keyArray = Object.keys(allergyPayload?.data);
    if (
      !keyArray?.includes("code") ||
      allergyPayload?.data?.start === null ||
      allergyPayload?.data?.start?.trim() === ""
    ) {
      alert("Please provide allergy");
    } else {
      const createdAllergy = await AllergyService.createAllergies(
        allergyPayload
      );
      const createdAllergyData = await AllergyService.getAllergyById(
        createdAllergy?.id
      );
      setPatientAllergies([
        ...patientAllergies,
        { resource: { ...createdAllergyData } },
      ]);
      setIsAllergyDrawerOpen(false);
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
          disabled={false}
          onCancelClick={() => {
            setIsProblemsDrawerOpen(false);
          }}
          patientId={id}
          updateProblems={updateProblemsState}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isVitalsDrawerOpen}
        onClose={() => {
          setVitalsDrawer(false);
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
        <CreateVitals
          disabled={false}
          onCancelClick={() => {
            setVitalsDrawer(false);
          }}
          patientId={id}
          handleClose={() => setVitalsDrawer(false)}
          onVitalsClick={() => {
            getVitals();
            setVitalsDrawer(false);
          }}
          patientDetails={patientDetails}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isAllergyDrawerOpen}
        onClose={() => {
          setIsAllergyDrawerOpen(false);
        }}
        variant="temporary"
        PaperProps={{
          sx: {
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px",
            height: "100%",
            overflowY: "scroll",
            position: "absolute",
            zIndex: 1500,
          },
        }}
      >
        <Allergy
          disabled={false}
          onAllergyChange={onAllergyChange}
          onDateChange={onAllergyDateChange}
          onReactionChange={onReactionChange}
          onSeverityChange={onSeverityChange}
          onStatusChange={onStatusChange}
          status={status}
          handleStatusChange={handleStatusChange}
          severity={severity}
          handleDateChange={handleDateChange}
          handleSeverityChange={handleSeverityChange}
          handleAllergyClick={() => {
            handleAllergyClick(allergyPayload);
          }}
          onCancelClick={() => {
            setIsAllergyDrawerOpen(false);
          }}
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
        <Paper></Paper>
      </Grid>

      <Grid sx={{}} lg={8}>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <DeviceThermostat />
                {BUTTON_LABELS.VITALS}
              </div>

              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setVitalsDrawer(true);
                  setCurrentDrawerIndex(1);
                }}
              >
                Create Vitals
              </Button>
            </Box>
            {/* <PamiV vitalsList={patientVitals} patientId={id} /> */}

            <TableContainer
              component={Paper}
              style={{ marginTop: theme.spacing(3) }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography>Vitals</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientVitals &&
                    patientVitals?.map((vital) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        vital?.resource?.extension?.find((ext) => {
                          return ext?.url?.endsWith(
                            "observation-document-date"
                          );
                        })?.valueString
                      );
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell align="center">
                            <Typography>
                              {vital?.resource?.code?.coding?.[0]?.display}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>
                              {dateObject?.DAY} {dateObject?.MONTH}{" "}
                              {dateObject?.DATE}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <Typography>{dateObject?.YEAR}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
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
              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setIsProblemsDrawerOpen(true);
                  setCurrentDrawerIndex(1);
                }}
              >
                Create Problems
              </Button>
            </Box>
            {/* <PamiV problemsList={patientProblems} updateProblem={updateProblemsState} patientId={id} /> */}
            <TableContainer
              component={Paper}
              style={{ marginTop: theme.spacing(3) }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography>Problems</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientProblems &&
                    patientProblems?.map((problem) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        problem?.resource?.recordedDate
                      );
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell align="center">
                            <Typography>
                              {problem?.resource?.text?.div}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>
                              {dateObject?.DAY} {dateObject?.MONTH}{" "}
                              {dateObject?.DATE}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <Typography>{dateObject?.YEAR}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
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

              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setIsAllergyDrawerOpen(true);
                }}
              >
                Create Allergies
              </Button>
            </Box>
            {/* <PamiV allergyList={patientAllergies} patientId={id} /> */}
            <TableContainer
              component={Paper}
              style={{ marginTop: theme.spacing(3) }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography>Allergies</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientAllergies &&
                    patientAllergies?.map((allergy) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        allergy?.resource?.recordedDate
                      );
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell align="center">
                            <Typography>
                              {allergy?.resource?.code?.coding?.[0]?.display}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>
                              {dateObject?.DAY} {dateObject?.MONTH}{" "}
                              {dateObject?.DATE}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <Typography>{dateObject?.YEAR}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
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

              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
              >
                Create Immunization
              </Button>
            </Box>
            <PamiV immunizationList={patientImmunizations} patientId={id} />
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
              <Button variant="contained" display="flex">
                Create Medications
              </Button>
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
