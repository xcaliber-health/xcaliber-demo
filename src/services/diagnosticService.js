import axios from "axios";
import { Helper } from "../core-utils/helper";

export const DiagnosticService = {
  getDiagnosticReport: async (patientId, departmentId, sourceId) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.get(
        `${sourceUrl}/DiagnosticReport?patient=${patientId}&category=lab-result&departmentId=${departmentId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": sourceId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching diagnostic report:", error);
      throw error;
    }
  },

  createDiagnosticReport: async (reportId, sourceId, payload) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.patch(
        `${sourceUrl}/DiagnosticReport/${reportId}`,
        payload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": sourceId,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error updating diagnostic report:", error);
      throw error;
    }
  },
};
