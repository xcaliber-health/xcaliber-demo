import axios from "axios";
import { Helper } from "../core-utils/helper";

export const ProblemService = {
  getProblems: async (patientId, departmentId, sourceId) => {
    try {
      let sourceType = "ATHENA";
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Condition?patient=${patientId}&category=problem-list-item${
          sourceType !== "ECW"
            ? `&departmentId=${departmentId}`
            : ""
        }`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${sourceId}`,
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

  getDiagnosis: async (patientId, departmentId, sourceId, encounterId, practiceId) => {
    try {
      let sourceType = "ATHENA";
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Condition?patient=${patientId}&category=encounter-diagnosis&practiceId=${practiceId}&departmentId=${departmentId}&encounter=${encounterId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${sourceId}`,
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
};
