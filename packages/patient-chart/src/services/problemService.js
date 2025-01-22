import axios from "axios";
import { Helper } from "../core-utils/helper";

export const ProblemService = {
  getProblems: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Condition?patient=${patientId}&category=problem-list-item${
          sourceType !== "ECW"
            ? `&departmentId=${localStorage.getItem(`DEPARTMENT_ID`)}`
            : ""
        }`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
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
  createProblem: async (problemPayload) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.post(
        `${sourceUrl}/Condition`,
        problemPayload,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data;
    } catch (error) {
      console.log(error);
    }
  },
  getProblemById: async (id, patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.get(
        `${sourceUrl}/Condition/${id}?patient=${patientId}&category=problem-list-item${
          sourceType !== "ECW"
            ? `&departmentId=${localStorage.getItem(`DEPARTMENT_ID`)}`
            : ""
        }`,
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
  updateProblem: async (problemId, patientId, payload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl();
      const result = await axios.put(
        `${sourceUrl}/Condition/${problemId}?patient=${patientId}&category=problem-list-item${
          sourceType !== "ECW"
            ? `&departmentId=${localStorage.getItem(`DEPARTMENT_ID`)}`
            : ""
        }`,
        payload,
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
