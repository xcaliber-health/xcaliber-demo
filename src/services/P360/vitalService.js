import axios from "axios";
import {
  XCHANGE_SERVICE_ENDPOINT,
  EPIC_XCHANGE_ENDPOINT,
} from "../../core-utils/constants";

export const VitalService = {
  getVitals: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/Observation?patient=${patientId}&category=vital-signs&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem(`XCALIBER_TOKEN`)}`,
          },
        }
      );
      return result?.data?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },

  createVitals: async (vitalsPayload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const response = await axios.post(
        `${sourceUrl}/api/v1/Observation`,
        vitalsPayload,
        {
          headers: {
            Authorization: localStorage.getItem("XCALIBER_SOURCE") === "EPIC" ? `${process.env.REACT_APP_EPIC_AUTHORIZATION}` : `${process.env.REACT_APP_AUTHORIZATION}`,
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
