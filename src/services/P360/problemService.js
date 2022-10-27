import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const ProblemService = {
  getProblems: async (patientId) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Condition?_count=3&patient=${patientId}&category=problem-list-item`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
          },
        }
      );
      return result?.data?.data?.entry?.slice(0, 2);
    } catch (error) {
      console.log(error);
    }
  },
  createProblem: async (problemPayload) => {
    try {
      const result = await axios.post(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Condition`,
        problemPayload,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
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
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Condition/${id}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
          },
        }
      );

      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
