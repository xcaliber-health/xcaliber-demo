import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, BLITZ_XCHANGE_ENDPOINT } from "../../core-utils/constants";

export const AppointmentService = {
  getUpcomingAppointments: async (patientId, currentDate) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      let dateVal =
        localStorage.getItem("XCALIBER_SOURCE") === "ELATION"
          ? `date=gt${currentDate}`
          : localStorage.getItem("XCALIBER_SOURCE") === "ATHENA"
          ? `start-date=${currentDate}`
          : "";
        
      const result = await axios.get(
        `${sourceUrl}/api/v1/Appointment?patient=${patientId}&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result.data?.data?.entry;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
  createAppointment: async (appointmentPayload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.post(
        `${sourceUrl}/api/v1/Appointment`,
        appointmentPayload,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );

      return result.data?.data?.id;
    } catch (error) {
      console.log(error);
    }
  },
  getAppointmentById: async (appointmentId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/Appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
