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
import CreateVitals from "./DrawerComponents/CreateVitals";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PatientProblems } from "./DrawerComponents/problems";
import CreateAppointment from "./CreateAppointment";
import Loading from "../Patient/Loading";
import { VitalService } from "../services/P360/vitalService";
import { ProblemService } from "../services/P360/problemService";
import { AllergyService } from "../services/P360/allergyService";
import { MedicationService } from "../services/P360/medicationService";
import { ImmunizationService } from "../services/P360/immunizationService";
import Allergy from "./DrawerComponents/createAllergies";
import { Helper } from "../core-utils/helper";
import { ReferenceDataService } from "../services/P360/referenceDataService";
import { CreateMedication } from "./DrawerComponents/createMedications";
import { SocketService } from "../socket";
import * as moment from "moment-timezone";
import Immunization from "./DrawerComponents/createImmunization";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import TimeLine from "./TabComponents/VisitsTab";
import { MedicationOrderService } from "../services/P360/medicationOrderService";
import { CreateMedicationOrder } from "./DrawerComponents/createMedicationOrders";
import { OrderService } from "../services/P360/orderService";

const Chart = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState({ id: id });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patientVitals, setPatientVitals] = useState([]);
  const [patientProblems, setPatientProblems] = useState([]);
  const [patientAllergies, setPatientAllergies] = useState([]);
  const [patientOrders, setPatientOrders] = useState([]);
  const [patientImmunizations, setPatientImmunizations] = useState([]);
  const [patientMedications, setPatientMedications] = useState([]);
  const [patientMedicationOrders, setPatientMedicationOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProblemsDrawerOpen, setIsProblemsDrawerOpen] = useState(false);
  const [isVitalsDrawerOpen, setVitalsDrawer] = useState(false);
  const [isAllergyDrawerOpen, setIsAllergyDrawerOpen] = useState(false);
  const [isMedicationDrawerOpen, setIsMedicationDrawerOpen] = useState(false);
  const [isMedicationOrderDrawerOpen, setIsMedicationOrderDrawerOpen] =
    useState(false);
  const [isImmunizationDrawerOpen, setIsImmunizationDrawerOpen] =
    useState(false);
  const [severity, setSeverity] = React.useState(null);
  const [currentTimezoneDate, setCurrentTimezoneDate] = useState(null);
  const [isVitalDisplayDrawerOpen, setIsVitalDisplayDrawerOpen] = useState("");
  const handleSeverityChange = (e) => {
    setSeverity(e);
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
      departmentId: localStorage.getItem(`DEPARTMENT_ID`),
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
              valueInteger: localStorage.getItem(`DEPARTMENT_ID`),
            },
          ]
          : [],
      participant: [
        {
          actor: {
            reference:
              localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION"
                ? "Practitioner/140857915539458"
                : "Practitioner/111",
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
              reference: `Location/${localStorage.getItem(`DEPARTMENT_ID`)}`,
            },
          },
      ],
    },
  });
  const [allergyPayload, setAllergyPayload] = useState({
    context: {
      departmentId: localStorage.getItem(`DEPARTMENT_ID`),
    },
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

  const getOrders = async () => {
    const response = await OrderService.getOrders(id);
    setPatientOrders(response);
  };
  const getMedications = async () => {
    const response = await MedicationService.getMedications(id);
    setPatientMedications(response);
  };

  const getImmunizations = async () => {
    const response = await ImmunizationService.getImmunization(id);
    setPatientImmunizations(response);
  };
  const getMedicationOrders = async () => {
    const response = await MedicationOrderService.getMedicationOrders(id);
    setPatientMedicationOrders(response);
  };

  const getVitals = async () => {
    const response = await VitalService.getVitals(id);
    let data = {};

    response.map((vital) => {
      let dateObject = localStorage.getItem("XCALIBER_SOURCE") === "ECW" ? Helper.extractFieldsFromDate(vital?.resource?.effectiveDateTime) : Helper.extractFieldsFromDate(
        vital?.resource?.extension?.find((ext) => {
          return (
            ext?.url?.endsWith("observation-document-date") ||
            ext?.url?.endsWith("created-date")
          );
        })?.valueString
      );
      const name = vital?.resource?.code?.coding?.[0]?.display;
      let value;
      if (name.toLowerCase().includes("body mass index")) {
        if (vital?.resource?.valueString) value = vital?.resource?.valueString;
        else value = vital?.resource?.valueQuantity.value;
      } else if (name.toLowerCase() == "blood pressure") {
        var systolic, diastolic;
        vital?.resource?.component?.map((code) => {
          if (code?.code?.coding?.[0]?.code == "8462-4") {
            diastolic = code?.valueQuantity?.value;
          } else if (code?.code?.coding?.[0]?.code == "8480-6") {
            systolic = code?.valueQuantity?.value;
          }
        });
        value = systolic + "/" + diastolic;
      } else {
        if (vital?.resource?.valueQuantity.unit)
          value =
            vital?.resource?.valueQuantity.value +
            " " +
            vital?.resource?.valueQuantity.unit;
        else value = vital?.resource?.valueQuantity.value;
      }
      let date =
        dateObject?.DAY + " " + dateObject?.MONTH + " " + dateObject?.DATE;
      let year = dateObject?.YEAR;
      let cal_date = new Date(
        dateObject?.MONTH + " " + dateObject?.DATE + " " + dateObject?.YEAR
      );
      if (
        Object.keys(data).includes(vital?.resource?.code?.coding?.[0]?.display)
      ) {
        const values = data[name];
        var low = 0;
        var high = values.length;
        var val = {
          value: value,
          date: date,
          year: year,
        };
        while (low < high) {
          var mid = (low + high) >>> 1;
          var dum_date = new Date(
            values[mid].date.slice(4, 10) + " " + values[mid].year
          );
          if (dum_date > cal_date) low = mid + 1;
          else high = mid;
        }
        var temp;
        for (let i = low; typeof values[i] !== "undefined"; i++) {
          temp = values[i];
          values[i] = val;
          val = temp;
        }
        values.push(val);
      } else {
        data[name] = [
          {
            value: value,
            date: date,
            year: year,
          },
        ];
      }
    });
    setPatientVitals(data);
  };
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [allergyReactionOptions, setAllergyReactionOptions] = useState([]);
  const [athenaSeverities, setAthenaSeverities] = useState([]);
  const updateOptions = async (searchTerm) => {
    const result = await ReferenceDataService.getAllergyData(searchTerm);
    setAllergyOptions(result);
  };
  const initialiseAllergyOptions = async () => {
    const result =
      localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`
        ? await ReferenceDataService.getAllergyData()
        : localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA"
          ? await ReferenceDataService.getAllergyData(`ab`)
          : await ReferenceDataService.getAllergyData();
    setAllergyOptions(result);
    setAllergyReactionOptions(result);
  };
  const initialiseAllergyReactions = async () => {
    let result = await ReferenceDataService.getAthenaAllergyReactions();
    setAllergyReactionOptions(result);
  };

  const initialiseAllergySeverities = async () => {
    let result = await ReferenceDataService.getAthenaAllergySeverities();
    setAthenaSeverities(result);
  };
  const [appointmentReasonOptions, setAppointmentReasonOptions] = useState([]);
  const initialiseAppointmentOptions = async () => {
    const result = await ReferenceDataService.getAppointmentData();
    setAppointmentReasonOptions(result);
  };

  const onReasonChange = (reason) => {
    setAppointmentPayload({
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
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
                  : reason.appointmenttypeid,
              display:
                localStorage.getItem("XCALIBER_SOURCE") === "ELATION"
                  ? reason
                  : reason.name,
            },
          ],
        },
      },
    });
  };
  const onDateChange = (dateObject) => {
    setAppointmentPayload({
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        ...appointmentPayload?.data,
        start: dateObject,
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
    finalDateValue = moment
      .tz(
        `${finalDateValue}${time}`,
        `YYYY-MM-DDTHH:mm:ss`,
        localStorage.getItem(`DEPARTMENT_TIMEZONE`)
      )
      .utc()
      .format();

    setAppointmentPayload({
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        ...appointmentPayload?.data,
        start: finalDateValue,
      },
    });
  };
  const updatePatientId = (patientId) => {
    setAppointmentPayload({
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        ...appointmentPayload?.data,
        participant: [
          {
            actor: {
              reference: `Patient/${patientId}`,
            },
            "type": { "coding": { "code": "patient", "system": "http://terminology.hl7.org/CodeSystem/participant-type" } }
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
  const onAllergyChange = (reference) => {
    setAllergyPayload({
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        ...allergyPayload?.data,
        code: {
          coding: [
            {
              system:
                localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`
                  ? `elation`
                  : localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`
                    ? `athena`
                    : ``,
              code:
                localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`
                  ? reference?.allergyid
                  : localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`
                    ? reference?.Concept_Code_2
                    : reference?.Concept_Code_2,
              display:
                localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`
                  ? reference?.allergenname
                  : localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`
                    ? reference?.Concept_Name_2
                    : reference?.Concept_Name_2,
            },
          ],
        },
      },
    });
  };
  const onReactionChange = (reaction1) => {
    if (localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`) {
      setAllergyPayload({
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: {
          ...allergyPayload?.data,
          reaction: [
            { ...allergyPayload?.data?.reaction?.[0], description: reaction1 },
          ],
        },
      });
    } else if (localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`) {
      setAllergyPayload({
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: {
          ...allergyPayload?.data,
          reaction: [
            {
              manifestation: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      display: reaction1?.reactionname,
                      code: reaction1?.snomedcode,
                    },
                  ],
                },
              ],
              extension: [
                {
                  url: `http://xcaliber-fhir/structureDefinition/severity-code`,
                  valueInteger: severity,
                },
              ],
            },
          ],
        },
      });
    }
  };
  const onSeverityChange = (severity) => {
    if (localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`) {
      setAllergyPayload({
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: {
          ...allergyPayload?.data,
          reaction: [
            { ...allergyPayload?.data?.reaction?.[0], severity: severity },
          ],
        },
      });
    } else if (localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`) {
      setAllergyPayload({
        context: {
          departmentId: localStorage.getItem(`DEPARTMENT_ID`),
        },
        data: {
          ...allergyPayload?.data,
          reaction:
            allergyPayload?.data?.reaction?.length > 0
              ? [
                {
                  manifestation: [
                    {
                      ...allergyPayload?.data?.reaction?.[0]
                        ?.manifestation?.[0],
                    },
                  ],
                  extension: [
                    {
                      url: `http://xcaliber-fhir/structureDefinition/severity-code`,
                      valueInteger: parseInt(severity),
                    },
                  ],
                },
              ]
              : [],
        },
      });
    }
    setSeverity(severity);
  };
  const onStatusChange = (status) => {
    setAllergyPayload({
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
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
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
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
      if (localStorage.getItem(`XCALIBER_SOURCE`) === `ELATION`) {
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
      } else if (localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`) {
        const createdAllergy = await AllergyService.createAllergies(
          allergyPayload
        );
        window.location.reload();
      }
      else {
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
      getMedicationOrders(),
      getOrders(),
    ])
      .then()
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const socket = SocketService.getSocket();
    socket.on("notification", (data) => {
      if (data?.source?.type === localStorage.getItem("XCALIBER_SOURCE")) {
        switch (data?.resource?.resourceType) {
          case "Condition":
            getProblems();
            break;
          case "AllergyIntolerance":
            getAllergies();
            break;
          case "Immunization":
            getImmunizations();
            break;
          case "Observation":
            getVitals();
            break;
          case "Medication":
            getMedications();
            break;
        }
      }
      console.log("Recieved notification", data);
    });
    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    {
      initialiseAllergyOptions();
      initialiseAppointmentOptions();
      appointmentReasonOptions;
      if (localStorage.getItem(`XCALIBER_SOURCE`) === `ATHENA`) {
        initialiseAllergyReactions();
        initialiseAllergySeverities();
      }
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
          initializeAppointmentReasons={initialiseAppointmentOptions}
          appointmentOptions={appointmentReasonOptions}
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
          allergyReactionOptions={allergyReactionOptions}
          athenaSeverities={athenaSeverities}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isMedicationDrawerOpen}
        onClose={() => {
          setIsMedicationDrawerOpen(false);
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
        <CreateMedication
          disabled={false}
          onCancelClick={() => {
            setIsMedicationDrawerOpen(false);
          }}
          patientId={id}
          handleClose={() => setIsMedicationDrawerOpen(false)}
          onMedicationClick={() => {
            getMedications();
            setIsMedicationDrawerOpen(false);
          }}
          patientDetails={patientDetails}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isMedicationOrderDrawerOpen}
        onClose={() => {
          setIsMedicationOrderDrawerOpen(false);
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
        <CreateMedicationOrder
          disabled={false}
          onCancelClick={() => {
            setIsMedicationOrderDrawerOpen(false);
          }}
          patientId={id}
          handleClose={() => setIsMedicationOrderDrawerOpen(false)}
          onMedicationClick={() => {
            getMedicationOrders();
            setIsMedicationOrderDrawerOpen(false);
          }}
          patientDetails={patientDetails}
          bookedNote={upcomingAppointments
            ?.filter((app) => {
              return app?.resource?.status === "booked";
            })
            ?.slice(0, 1)}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isImmunizationDrawerOpen}
        onClose={() => {
          setIsImmunizationDrawerOpen(false);
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
        <Immunization
          disabled={false}
          handleImmunizationClick={() => {
            getImmunizations();
            setIsImmunizationDrawerOpen(false);
          }}
          onCancelClick={() => {
            setIsImmunizationDrawerOpen(false);
          }}
          patientId={id}
        />
      </Drawer>
      {isVitalDisplayDrawerOpen !== "" && (
        <Drawer
          anchor={"right"}
          open={isVitalDisplayDrawerOpen !== ""}
          variant="temporary"
          onClose={() => {
            setIsVitalDisplayDrawerOpen("");
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
          <Typography>{isVitalDisplayDrawerOpen}</Typography>
          <TableContainer
            component={Paper}
            style={{ marginTop: theme.spacing(3) }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
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
                  patientVitals[isVitalDisplayDrawerOpen].map((vital) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <Typography>{vital.value}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography>{vital.date}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography>{vital.year}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Drawer>
      )}
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
              <Tab label="Requests" style={{ width: "25%" }} />
              <Tab label="Allergies" style={{ width: "25%" }} />
              <Tab label="Immunizations" style={{ width: "25%" }} />
              <Tab label="Medications" style={{ width: "25%" }} />
              <Tab label="Medication Orders" style={{ width: "25%" }} />
              <Tab label="Visits" style={{ width: "25%" }} />
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  getVitals();
                }}
                sx={{
                  marginRight: "36px",
                  marginLeft: "18px",
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setVitalsDrawer(true);
                }}
              >
                Add Vitals
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
                    Object.keys(patientVitals).map((key, index) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setIsVitalDisplayDrawerOpen(key);
                          }}
                        >
                          <TableCell align="left">
                            <Typography>{key}</Typography>
                          </TableCell>
                          <TableCell>
                            <Grid display="flex">
                              <Typography>
                                {patientVitals[key][0].value}
                              </Typography>
                            </Grid>
                          </TableCell>
                          <TableCell align="left">
                            <Typography>
                              {patientVitals[key][0].date}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <Typography>
                              {patientVitals[key][0].year}
                            </Typography>
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  getProblems();
                }}
                sx={{
                  marginRight: "36px",
                  marginLeft: "18px",
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setIsProblemsDrawerOpen(true);
                }}
              >
                Add Problems
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
                              {localStorage.getItem("XCALIBER_SOURCE") ===
                                "ELATION" || localStorage.getItem("XCALIBER_SOURCE") ===
                                "ECW"
                                ? problem?.resource?.note?.[0]?.text &&
                                  problem?.resource?.note?.[0]?.text !== null
                                  ? problem?.resource?.note?.[0]?.text
                                  : ""
                                : localStorage.getItem(`XCALIBER_SOURCE`) ===
                                  "ATHENA"
                                  ? problem?.resource?.contained?.[0]?.notes
                                    ?.text &&
                                    problem?.resource?.contained?.[0]?.notes
                                      ?.text !== null
                                    ? problem?.resource?.contained?.[0]?.notes
                                      ?.text
                                    : ""
                                  : ""}
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  getOrders();
                }}
                sx={{
                  marginRight: "36px",
                  marginLeft: "18px",
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  //TO-DO
                  // setIsAllergyDrawerOpen(true);
                }}
              >
                Add Orders
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
                      <Typography>Time</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>Request</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientOrders &&
                    patientOrders?.map((order) => {
                      let dateObject = Helper.extractFieldsFromDate(
                        order?.resource?.occurrenceDateTime
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
                              {dateObject?.YEAR && dateObject?.YEAR !== NaN
                                ? `${dateObject?.DAY} ${dateObject?.MONTH}
                                ${dateObject?.DATE}`
                                : ""}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {order?.resource?.code?.coding[0]?.display}
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  getAllergies();
                }}
                sx={{
                  marginRight: "36px",
                  marginLeft: "18px",
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setIsAllergyDrawerOpen(true);
                }}
              >
                Add Allergies
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
                        allergy?.resource?.onsetDateTime
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
                              ?.display ?? ""}
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
                                : ``}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            <Typography>
                              {dateObject?.YEAR && dateObject?.YEAR !== NaN
                                ? dateObject?.YEAR
                                : ""}
                            </Typography>
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
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  getImmunizations();
                }}
                sx={{
                  marginRight: "36px",
                  marginLeft: "18px",
                }}
              >
                <RefreshIcon />
              </IconButton>
              <Button
                sx={{ display: "flex", alignSelf: "flex-end" }}
                variant="contained"
                onClick={() => {
                  setIsImmunizationDrawerOpen(true);
                }}
              >
                Add Immunization
              </Button>
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
          <TabPanel value={value} index={6}>
            {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
              <Grid>
                <Box
                  alignSelf="flex-start"
                  flexDirection={"row-reverse"}
                  display="flex"
                  // marginLeft={theme.spacing(3)}
                  // marginRight={theme.spacing(3)}
                  marginBottom={theme.spacing(3)}
                  marginLeft={theme.spacing(3)}
                >
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => {
                      getMedications();
                    }}
                    sx={{
                      marginRight: "36px",
                      marginLeft: "18px",
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>

                  <Button
                    variant="contained"
                    display="flex"
                    onClick={() => {
                      setIsMedicationDrawerOpen(true);
                    }}
                  >
                    Add Medications
                  </Button>
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
                            medication?.resource?.effectivePeriod?.start
                          );
                          return (
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <TableCell align="left">
                                <Typography>
                                  {
                                    medication?.resource
                                      ?.medicationCodeableConcept?.coding?.[0]
                                      ?.display
                                  }{" "}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>
                                  {Object.values(dateObject).every(
                                    (dateobj) => {
                                      return (
                                        dateobj !== "Invalid Choice" &&
                                        dateobj !== NaN
                                      );
                                    }
                                  )
                                    ? `${dateObject?.DAY} ${dateObject?.MONTH} ${dateObject?.DATE}`
                                    : ""}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                              >
                                <Typography>
                                  {dateObject?.YEAR && dateObject?.YEAR !== NaN
                                    ? dateObject?.YEAR
                                    : ""}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            {localStorage.getItem("XCALIBER_SOURCE") === "ELATION" && (
              <Grid>
                <Typography variant="h5">
                  Elation does not support medication
                </Typography>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={value} index={7}>
            {localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" && (
              <Grid>
                <Box
                  alignSelf="flex-start"
                  flexDirection={"row-reverse"}
                  display="flex"
                  // marginLeft={theme.spacing(3)}
                  // marginRight={theme.spacing(3)}
                  marginBottom={theme.spacing(3)}
                  marginLeft={theme.spacing(3)}
                >
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => {
                      getMedicationOrders();
                    }}
                    sx={{
                      marginRight: "36px",
                      marginLeft: "18px",
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>

                  <Button
                    variant="contained"
                    display="flex"
                    onClick={() => {
                      setIsMedicationOrderDrawerOpen(true);
                    }}
                  >
                    Add Medication Order
                  </Button>
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
                      {patientMedicationOrders &&
                        patientMedicationOrders?.map((medication) => {
                          let dateObject = Helper.extractFieldsFromDate(
                            medication?.resource?.authoredOn
                          );
                          return (
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <TableCell align="left">
                                <Typography>
                                  {
                                    medication?.resource
                                      ?.medicationCodeableConcept?.text
                                  }{" "}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>
                                  {Object.values(dateObject).every(
                                    (dateobj) => {
                                      return (
                                        dateobj !== "Invalid Choice" &&
                                        dateobj !== NaN
                                      );
                                    }
                                  )
                                    ? `${dateObject?.DAY} ${dateObject?.MONTH} ${dateObject?.DATE}`
                                    : ""}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                              >
                                <Typography>
                                  {dateObject?.YEAR && dateObject?.YEAR !== NaN
                                    ? dateObject?.YEAR
                                    : ""}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            {localStorage.getItem("XCALIBER_SOURCE") === "ELATION" && (
              <Grid>
                <Typography variant="h5">
                  Elation does not support medication
                </Typography>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={value} index={8}>
            <TimeLine patientDetails={patientDetails} />
            {/* <div>hi</div> */}
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
      style={{ overflowX: "scroll", overflowY: "auto", width: "100%", height: "auto" }}
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
