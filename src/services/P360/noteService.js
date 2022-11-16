import axios from "axios";
import {
  DEPARTMENT_ID,
  XCHANGE_SERVICE_ENDPOINT,
} from "../../core-utils/constants";

export const NoteService = {
  getVisitNotes: async (patientId) => {
    try {
      const response = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference?patient=${patientId}&type=visit-notes&departmentId=150&start-date=2022-01-01`,
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
          if (
            resource?.resource?.category?.[0]?.coding?.[0]?.display ===
            "Complete H&P (2 col A/P)"
          ) {
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
      let encounterId = "0";
      if (localStorage.getItem(`XCALIBER_SOURCE`) === "ATHENA") {
        await axios
          .patch(
            `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Appointment/${appointmentId}`,
            {
              context: {
                departmentId: DEPARTMENT_ID,
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
            `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Appointment/${appointmentId}`,
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
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference?type=visit-notes&encounter=${encounterId}`,
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
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference/${noteId}?type=visit-notes`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
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
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference/?patient=${patientId}&departmentId=150&appointment=${appointmentId}`,
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
