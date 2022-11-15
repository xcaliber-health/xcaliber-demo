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
import { ReferenceDataService } from "../services/P360/referenceDataService";

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
  const [currentTimezoneDate, setCurrentTimezoneDate] = useState(null);
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
    context: {
      departmentId: "1",
    },
    data: {
      resourceType: "Appointment",
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
      status: "booked",
      extension:
        localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA"
          ? [
              {
                url: "http://xcaliber-fhir/structureDefinition/copay",
                valueString: {
                  collectedforother: 0,
                  collectedforappointment: 0,
                  insurancecopay: 0,
                },
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/copay",
                valueString: 0,
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/department-id",
                valueInteger: "150",
              },
            ]
          : [],
      participant: [
        {
          actor: {
            reference:
              localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
                ? "Practitioner/140857915539458"
                : "Practitioner/89",
          },
        },
        {
          actor: {
            reference: "HealthcareService/140857911017476",
          },
        },
        localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
          ? {}
          : {
              actor: {
                reference: "Location/1",
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
  const [allergyOptions, setAllergyOptions] = useState([]);
  const updateOptions = async (searchTerm) => {
    const result = await ReferenceDataService.getAllergyData(searchTerm);
    setAllergyOptions(result);
  };
  const initialiseAllergyOptions = async () => {
    const result = await ReferenceDataService.getAllergyData();
    setAllergyOptions(result);
  };

  const onReasonChange = (reason) => {
    setAppointmentPayload({
      context: {
        departmentId: "1",
      },
      data: {
        ...appointmentPayload?.data,
        appointmentType: {
          coding: [
            {
              system: "https://hl7.org/fhir/v2/ValueSet/appointment-type",
              code:
                localStorage.getItem("XCALIBER_SOURCE") === "ELATION"
                  ? reason
                  : "422",
              display: reason,
            },
          ],
        },
      },
    });
  };
  const onDateChange = (dateObject) => {
    if (dateObject.getTimezoneOffset() < 0)
      dateObject.setMinutes(
        dateObject.getMinutes() - -dateObject.getTimezoneOffset()
      );
    else
      dateObject.setMinutes(
        dateObject.getMinutes() - dateObject.getTimezoneOffset()
      );
    let hourValue =
      dateObject.getHours() <= 9
        ? `0${dateObject.getHours()}`
        : `${dateObject.getHours()}`;
    let dateInUtc = `${dateObject.getFullYear()}-${
      dateObject.getMonth() + 1
    }-${dateObject.getDate()}T${hourValue}:${dateObject.getMinutes()}:0${dateObject.getSeconds()}Z`;

    setAppointmentPayload({
      context: {
        departmentId: "1",
      },
      data: {
        ...appointmentPayload?.data,
        start: dateInUtc,
      },
    });
  };
  const onTimeChange = (time) => {
    let finalDateValue;
    if (currentTimezoneDate?.slice(0, 10)?.endsWith("T")) {
      finalDateValue = currentTimezoneDate?.slice(0, 9);
    } else {
      finalDateValue = currentTimezoneDate?.slice(0, 10);
    }
    const hourMinuteSecondData = time?.slice(1, -1)?.split(":");
    finalDateValue = new Date(finalDateValue);
    finalDateValue.setHours(hourMinuteSecondData[0]);
    finalDateValue.setMinutes(hourMinuteSecondData[1]);
    finalDateValue.setSeconds(hourMinuteSecondData[2]);
    if (finalDateValue.getTimezoneOffset() < 0)
      finalDateValue.setMinutes(
        finalDateValue.getMinutes() - -finalDateValue.getTimezoneOffset()
      );
    else
      finalDateValue.setMinutes(
        finalDateValue.getMinutes() - finalDateValue.getTimezoneOffset()
      );
    let hourValue =
      dateObject.getHours() <= 9
        ? `0${dateObject.getHours()}`
        : `${dateObject.getHours()}`;
    setAppointmentPayload({
      context: {
        departmentId: "1",
      },
      data: {
        ...appointmentPayload?.data,
        start: `${finalDateValue.getFullYear()}-${
          finalDateValue.getMonth() + 1
        }-${finalDateValue.getDate()}T${hourValue}:${finalDateValue.getMinutes()}:${finalDateValue.getSeconds()}Z`,
      },
    });
  };
  const updatePatientId = (patientId) => {
    setAppointmentPayload({
      context: {
        departmentId: "1",
      },
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
      // reaction["description"] = severity;
      reaction["severity"] = severity;
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
  useEffect(() => {
    {
      initialiseAllergyOptions();
    }
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const updateTimezoneDate = (dateTobeUpdated) => {
    setCurrentTimezoneDate(dateTobeUpdated);
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
          updateCurrentTimezoneDate={updateTimezoneDate}
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
            // justifyContent: "space-between",
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
          initializeAllergyOptions={() => {
            initialiseAllergyOptions;
          }}
          patientId={id}
          allergyOptions={allergyOptions}
          updateOptions={updateOptions}
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
              flexDirection={"row-reverse"}
              display="flex"
              // marginLeft={theme.spacing(3)}
              // marginRight={theme.spacing(3)}
              marginBottom={theme.spacing(3)}
              marginLeft={theme.spacing(3)}
            >
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
                    <TableCell align="left">
                      <Typography>Vitals</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>Value</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientVitals &&
                    patientVitals?.map((vital) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        vital?.resource?.extension?.find((ext) => {
                          return (
                            ext?.url?.endsWith("observation-document-date") ||
                            ext?.url?.endsWith("created-date")
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
                          <TableCell align="left">
                            <Typography>
                              {vital?.resource?.code?.coding?.[0]?.display}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Grid display="flex">
                              <Typography>
                                {vital?.resource?.code?.coding?.[0]?.display?.toLowerCase() ===
                                "body mass index"
                                  ? vital?.resource?.valueString
                                  : vital?.resource?.code?.coding?.[0]?.display?.toLowerCase() ===
                                    "blood pressure"
                                  ? vital?.resource?.component[0]?.valueQuantity
                                      .value
                                  : vital?.resource?.valueQuantity.value}
                              </Typography>

                              {vital?.resource?.code?.coding?.[0]?.display?.toLowerCase() ===
                                "blood pressure" && (
                                <>
                                  <Typography>/</Typography>
                                  <Typography>
                                    {vital?.resource?.code?.coding?.[0]?.display?.toLowerCase() ===
                                    "blood pressure"
                                      ? vital?.resource?.component[1]
                                          ?.valueQuantity.value
                                      : ""}
                                  </Typography>
                                </>
                              )}
                            </Grid>
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {dateObject?.DAY} {dateObject?.MONTH}{" "}
                              {dateObject?.DATE}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
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
            <NotesTab
              patientDetails={patientDetails}
              bookedNote={upcomingAppointments
                ?.filter((app) => {
                  return app?.resource?.status === "booked";
                })
                ?.slice(0, 1)}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Box
              alignSelf="flex-start"
              flexDirection={"row-reverse"}
              display="flex"
              marginBottom={theme.spacing(3)}
              marginLeft={theme.spacing(3)}
            >
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
                    <TableCell align="left">
                      <Typography>Problems</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Synopsis</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientProblems &&
                    patientProblems?.map((problem) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        problem?.resource?.onsetDateTime
                      );
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell align="left">
                            <Typography>
                              {problem?.resource?.text?.div &&
                                problem?.resource?.text?.div}
                              {problem?.resource?.code?.coding?.[0]?.display}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {problem?.resource?.note?.[0]?.text &&
                              problem?.resource?.note?.[0]?.text?.trim() !== ""
                                ? problem?.resource?.note?.[0]?.text
                                : "null"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>
                              {dateObject?.DAY} {dateObject?.MONTH}{" "}
                              {dateObject?.DATE}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
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
              flexDirection={"row-reverse"}
              display="flex"
              // marginLeft={theme.spacing(3)}
              // marginRight={theme.spacing(3)}
              marginBottom={theme.spacing(3)}
              marginLeft={theme.spacing(3)}
            >
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
                    <TableCell align="left">
                      <Typography>Allergies</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Status</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="left">
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
                          <TableCell align="left">
                            <Typography>
                              {allergy?.resource?.code?.coding?.[0]?.display}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {allergy?.resource?.clinicalStatus?.coding?.[0]
                              ?.display ?? "null"}
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {Object.values(dateObject).every((dateObj) => {
                                return (
                                  dateObj !== "Invalid Choice" &&
                                  dateObj !== NaN
                                );
                              })
                                ? `${dateObject?.DAY} ${dateObject?.MONTH}
                                ${dateObject?.DATE}`
                                : `null`}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <Typography>
                              {dateObject?.YEAR && dateObject?.YEAR !== NaN
                                ? dateObject?.YEAR
                                : "null"}
                            </Typography>
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
              flexDirection={"row-reverse"}
              display="flex"
              // marginLeft={theme.spacing(3)}
              // marginRight={theme.spacing(3)}
              marginBottom={theme.spacing(3)}
              marginLeft={theme.spacing(3)}
            >
              {/* <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
              >
                Create Immunization
              </Button> */}
            </Box>
            {/* <PamiV immunizationList={patientImmunizations} patientId={id} /> */}
            <TableContainer
              component={Paper}
              style={{ marginTop: theme.spacing(3) }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Typography>Immunizations</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientImmunizations &&
                    patientImmunizations?.map((immunization) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        immunization?.resource?.occurrenceDateTime
                      );
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell align="left">
                            <Typography>
                              {
                                immunization?.resource?.vaccineCode?.coding?.[0]
                                  ?.display
                              }{" "}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {dateObject?.DAY} {dateObject?.MONTH}{" "}
                              {dateObject?.DATE}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <Typography>{dateObject?.YEAR}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <Box
              alignSelf="flex-start"
              flexDirection={"row-reverse"}
              display="flex"
              // marginLeft={theme.spacing(3)}
              // marginRight={theme.spacing(3)}
              marginBottom={theme.spacing(3)}
              marginLeft={theme.spacing(3)}
            >
              {/* <Button variant="contained" display="flex">
                Create Medications
              </Button> */}
            </Box>
            <TableContainer
              component={Paper}
              style={{ marginTop: theme.spacing(3) }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Typography>Medication</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Year</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientMedications &&
                    patientMedications?.map((medication) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        medication?.resource?.effectiveDateTime
                      );
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell align="left">
                            <Typography>
                              {
                                medication?.resource?.medicationCodeableConcept
                                  ?.coding?.[0]?.display
                              }{" "}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {Object.values(dateObject).every((dateobj) => {
                                return (
                                  dateobj !== "Invalid Choice" &&
                                  dateobj !== NaN
                                );
                              })
                                ? `${dateObject?.DAY} ${dateObject?.MONTH} $
                              {dateObject?.DATE}`
                                : "null"}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <Typography>
                              {dateObject?.YEAR && dateObject?.YEAR
                                ? dateObject?.YEAR !== NaN
                                : "null"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
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
