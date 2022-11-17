import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const AppointmentService = {
  getUpcomingAppointments: async (patientId, currentDate) => {
    try {
      let dateVal =
        localStorage.getItem("XCALIBER_SOURCE") === "ELATION"
          ? `date=gt${currentDate}`
          : localStorage.getItem("XCALIBER_SOURCE") === "ATHENA"
          ? `start-date=${currentDate}`
          : "";
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Appointment?patient=${patientId}&${dateVal}&departmentId=150`,
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
      const result = await axios.post(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Appointment`,
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
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Appointment/${appointmentId}`,
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
