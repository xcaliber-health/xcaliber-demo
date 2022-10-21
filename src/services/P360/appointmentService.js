import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const AppointmentService = {
  getUpcomingAppointments: async (patientId, currentDate) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Appointment?patient=${patientId}&date=gt${currentDate}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
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
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
          },
        }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
};
