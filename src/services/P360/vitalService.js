import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const VitalService = {
  getVitals: async (patientId) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Observation?patient=${patientId}&category=vital-signs&departmentId=150`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem(`XCALIBER_TOKEN`)}`,
          },
        }
      );
      return result?.data?.data?.entry?.slice(0, 10);
    } catch (error) {
      console.log(error);
    }
  },

  createVitals: async (vitalsPayload) => {
    try {
      const response = await axios.post(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Observation`,
        vitalsPayload,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem(`XCALIBER_TOKEN`)}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
