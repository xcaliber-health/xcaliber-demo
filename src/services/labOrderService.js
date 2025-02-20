import axios from "axios";
import { Helper } from "../core-utils/helper";

export const LabOrderService = {
  getLabOrder: async (patientId, categoryCode, encounterId, sourceId) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.get(
        `${sourceUrl}/ServiceRequest?patient=${patientId}&categorycode=${categoryCode}&encounter=${encounterId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "Content-Type": "application/json",
            "x-source-id": sourceId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching service request data:", error);
    }
  },

  createLabOrder: async (payload, sourceId) => {
    sourceId;
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.post(
        `${sourceUrl}/ServiceRequest`,
        payload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "Content-Type": "application/json",
            "x-source-id": sourceId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating service request:", error);
    }
  },
};
