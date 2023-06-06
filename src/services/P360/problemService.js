import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, BLITZ_XCHANGE_ENDPOINT } from "../../core-utils/constants";

export const ProblemService = {
  getProblems: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/Condition?patient=${patientId}&category=problem-list-item&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
  createProblem: async (problemPayload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.post(
        `${sourceUrl}/api/v1/Condition`,
        problemPayload,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data;
    } catch (error) {
      console.log(error);
    }
  },
  getProblemById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? BLITZ_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/Condition/${id}`,
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
