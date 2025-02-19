import axios from "axios";
import { Helper } from "../core-utils/helper";

export const VitalService = {
  getVitals: async (patientId, sourceId, departmentId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Observation?patient=${patientId}&category=vital-signs${
          sourceType !== "ECW" ? `&departmentId=${departmentId}` : ""
        }`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": sourceId,
          },
        }
      );
      return result?.data?.data?.entry
        ? result?.data?.data?.entry
        : result?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },

  createVitals: async (vitalsPayload) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.post(
        `${sourceUrl}/Observation`,
        vitalsPayload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
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
