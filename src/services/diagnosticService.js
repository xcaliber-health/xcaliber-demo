import axios from "axios";
import { Helper } from "../core-utils/helper";

export const DiagnosticService = {
  getDiagnosticReport: async (patientId, departmentId, sourceId) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      let batchSize = 50;
      let totalRecords = 0;

      // 🔹 First API call to get the total count
      const countResponse = await axios.get(
        `${sourceUrl}/DiagnosticReport?patient=${patientId}&category=lab-result&departmentId=${departmentId}&_count=1`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": sourceId,
          },
        }
      );

      totalRecords = countResponse.data?.data?.total || 0;

      let offset = Math.max(0, totalRecords - batchSize);

      const response = await axios.get(
        `${sourceUrl}/DiagnosticReport?patient=${patientId}&category=lab-result&departmentId=${departmentId}&_count=${batchSize}&_offset=${offset}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": sourceId,
          },
        }
      );

      const latestEntries = response.data?.data?.entry || [];

      return latestEntries;
    } catch (error) {
      console.log("Error fetching diagnostic reports:", error);
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
