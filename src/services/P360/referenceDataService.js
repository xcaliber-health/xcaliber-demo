import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const ReferenceDataService = {
  getProblemData: async (searchString) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?category=problems&resourceType=condition&searchString=${
          searchString ?? "abc"
        }`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getAllergyData: async (searchString) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=allergy&searchString=${
          searchString ?? "abe"
        }`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getAthenaAllergyReactions: async () => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=allergy&dataField=reactions`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getAthenaAllergySeverities: async () => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=allergy&dataField=severities`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getAppointmentData: async () => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=appointment&dataField=type`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result.appointmenttypes;
    } catch (error) {
      console.log(error);
    }
  },
  getMedicationData: async (searchString) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=medicationstatement&searchString=${
          searchString ?? ""
        }`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getMedicationStopReasonsData: async () => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=medicationstatement&dataField=reasons`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getVaccineData: async (searchString) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=immunization&searchString=${
          searchString ?? ""
        }`,
        {
          headers: {
            apikey: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
};
