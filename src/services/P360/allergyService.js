import axios from "axios";
import { result } from "lodash";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const AllergyService = {
  getAllergies: async (patientId) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/AllergyIntolerance?patient=${patientId}&departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.entry?.slice(0, 10);
    } catch (error) {
      console.log(error);
    }
  },
  createAllergies: async (allergyPayload) => {
    try {
      const result = await axios.post(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/AllergyIntolerance`,
        allergyPayload,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
  getAllergyById: async (id) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/AllergyIntolerance/${id}`,
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
