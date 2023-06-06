import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, BLITZ_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import getPractitionerById, {
  PractitionerService,
} from "./practitionerService";

export const NoteService = {
  getNotesForTimeLine: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const response = await axios.get(
        `${sourceUrl}/api/v1/DocumentReference?patient=${patientId}&category=visit_notes&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      let count = 0;
      const notes = [];
      for (let i = 0; i < response.data?.data?.entry?.length; i++) {
        const resource = response.data?.data?.entry?.[i];
        // if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
        //   if (
        //     resource?.resource?.category?.[0]?.coding?.[0]?.display ===
        //     "Complete H&P (2 col A/P)"
        //   ) {
        //     notes.push(resource);
        //     count++;
        //   }
        // } else if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
        //   if (
        //     resource?.resource?.category?.[0]?.coding?.[0]?.display ===
        //     "Progress note"
        //   ) {
        notes.push(resource);
        //   count++;
        // }
      }
      const encounterIds = [];
      let conditionUrl;
      if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
        conditionUrl = "";
        const invoices = await axios.get(
          `${sourceUrl}/api/v1/Invoice?patient=${patientId}`,
          {
            headers: {
              Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
              "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            },
          }
        );
        for (let i in invoices?.data?.data?.entry) {
          for (let j in invoices?.data?.data?.entry?.[i]?.resource?.extension) {
            if (
              invoices?.data?.data?.entry[i]?.resource?.extension?.[
                j
              ]?.url.includes("/id")
            ) {
              encounterIds.push(
                invoices?.data?.data?.entry[i]?.resource?.extension?.[j]
                  ?.valueString
              );
            }
          }
        }
      } else {
        for (let i in notes) {
          conditionUrl = `&departmentId=${localStorage.getItem(
            `DEPARTMENT_ID`
          )}&visitType=note`;
          encounterIds.push(notes[i].resource.id);
          // if (diagnosisIds.includes(parseInt(notes[i].resource.id))) {
          //   date.push(notes[i]?.resource?.context?.period?.start);
          //   practionerIds.push(notes[i]?.resource?.author?.[0]?.reference);
          //   for (let j in notes[i]?.resource?.content) {
          //     if (
          //       notes[i]?.resource?.content?.[j]?.attachment?.title == "Problem"
          //     ) {
          //       summary.push(notes[i]?.resource?.content?.[j]?.attachment?.data);
          //       break;
          //     }
          //   }
          // }
        }
      }
      const diagnosisIds = [];
      const diagnosisNames = [];
      for (let i in encounterIds) {
        const encounters = await axios.get(
          `${sourceUrl}/api/v1/Condition?category=encounter-diagnosis&patient=${patientId}&encounter=${encounterIds[i]}${conditionUrl}`,
          {
            headers: {
              Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
              "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            },
          }
        );
        if (encounters?.data?.data?.entry?.[0]?.resource?.code) {
          diagnosisIds.push(encounterIds[i]);
          diagnosisNames.push(
            encounters?.data?.data?.entry?.[0]?.resource?.code?.coding?.[0]
              ?.display
          );
        }
      }

      const practionerIds = [];
      const date = [];
      const summary = [];
      for (let i in notes) {
        if (diagnosisIds.includes(parseInt(notes[i].resource.id))) {
          date.push(notes[i]?.resource?.context?.period?.start);
          practionerIds.push(notes[i]?.resource?.author?.[0]?.reference);
          for (let j in notes[i]?.resource?.content) {
            if (
              notes[i]?.resource?.content?.[j]?.attachment?.title == "Problem"
            ) {
              summary.push(notes[i]?.resource?.content?.[j]?.attachment?.data);
              break;
            }
          }
        }
      }

      const practionerName = [];
      for (let i in practionerIds) {
        const practioner = await PractitionerService.getPractitionerById(
          `Practitioner/${practionerIds[i]}`
        );
        practionerName.push(
          practioner?.entry?.[0]?.resource?.name?.[0]?.given?.[0]
        );
      }

      const result = [];
      for (let i in practionerIds) {
        let note = {
          date: date[i],
          provider: practionerName[i],
          diagnosis: diagnosisNames[i],
          encounterId: diagnosisIds[i],
          practionerId: practionerIds[i],
          summary: summary[i],
        };
        result.push(note);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  getVisitNotes: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const response = await axios.get(
        `${sourceUrl}/api/v1/DocumentReference?patient=${patientId}&category=visit_notes&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}&start-date=2022-01-01`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      let count = 0;
      const notes = [];
      for (let i = 0; i < response.data?.data?.entry?.length; i++) {
        const resource = response.data?.data?.entry?.[i];
        if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
          const template = resource?.resource?.extension?.find((ext) =>
            ext?.url?.includes("template")
          )?.valueString;
          if (template && template === "Complete H&P (2 col A/P)") {
            notes.push(resource);
            count++;
          }
        } else if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
          if (
            resource?.resource?.category?.[0]?.coding?.[0]?.display ===
            "Progress note"
          ) {
            notes.push(resource);
            count++;
          }
        }
      }
      return notes;
    } catch (error) {
      console.log(error);
    }
  },
  createNote: async (notePayload, appointmentId = "0") => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      let encounterId = "0";
      if (localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA") {
        await axios
          .patch(
            `${sourceUrl}/api/v1/Appointment/${appointmentId}`,
            {
              context: {
                departmentId: localStorage.getItem(`DEPARTMENT_ID`),
              },
              data: {
                status: "checked-in",
              },
            },
            {
              headers: {
                Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          )
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });
        await axios
          .get(
            `${sourceUrl}/api/v1/Appointment/${appointmentId}`,
            {
              headers: {
                Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
                "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          )
          .then((res) => {
            encounterId =
              res.data?.data?.supportingInformation?.[0]?.reference?.split(
                "Encounter/"
              )[1];
          })
          .catch(() => {
            console.log(error);
          });
      }
      const response = await axios.post(
        `${sourceUrl}/api/v1/DocumentReference?category=visit_notes&encounter=${encounterId}`,
        notePayload,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return response.data?.data?.id;
    } catch (error) {
      console.log(error);
    }
  },
  getVisitNoteById: async (noteId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/DocumentReference/${noteId}?category=visit_notes`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
  getNoteByAppointmentId: async (patientId, appointmentId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/DocumentReference/?patient=${patientId}&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}&appointment=${appointmentId}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return result?.data?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
};
