import axios from "axios";
import { result } from "lodash";
import {
  EPIC_XCHANGE_ENDPOINT,
  XCHANGE_SERVICE_ENDPOINT,
} from "../../core-utils/constants";

export const AllergyService = {
  getAllergies: async (patientId) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;

      const result = await axios.get(
        `${sourceUrl}/api/v1/AllergyIntolerance?patient=${patientId}&departmentId=${localStorage.getItem(
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
  createAllergies: async (allergyPayload) => {
    try {
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.post(
        `${sourceUrl}/api/v1/AllergyIntolerance`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(`${sourceUrl}/api/v1/AllergyIntolerance/${id}`, {
        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
        },
      });

      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
