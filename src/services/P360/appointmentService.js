import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';

export const AppointmentService = {
  getUpcomingAppointments: async (patientId, currentDate) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      let dateVal =
        localStorage.getItem("XCALIBER_SOURCE") === "ELATION"
          ? `date=gt${currentDate}`
          : localStorage.getItem("XCALIBER_SOURCE") === "ATHENA"
          ? `start-date=${currentDate}`
          : "";
        
      const result = await axios.get(
        `${sourceUrl}/Appointment?patient=${patientId}${sourceType !== 'ECW' ? `&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}` : ""}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result.data?.data?.entry ? result.data?.data?.entry : result.data?.entry;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
  createAppointment: async (appointmentPayload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.post(
        `${sourceUrl}/Appointment`,
        appointmentPayload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
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
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.get(
        `${sourceUrl}/Appointment/${appointmentId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data ? result?.data?.data : result?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
