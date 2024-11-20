import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';

export const ProblemService = {
  getProblems: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.get(
        `${sourceUrl}/Condition?patient=${patientId}&category=problem-list-item${sourceType !== 'ECW' && `&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.entry ? result?.data?.data?.entry : result?.data?.entry;;
    } catch (error) {
      console.log(error);
    }
  },
  createProblem: async (problemPayload) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
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
  getProblemById: async (id) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl = Helper.getSourceUrl()
      const result = await axios.get(
        `${sourceUrl}/Condition/${id}`,
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
