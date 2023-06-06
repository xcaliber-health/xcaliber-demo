import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT, EPIC_XCHANGE_ENDPOINT } from "../../core-utils/constants";

export const ReferenceDataService = {
  getProblemData: async (searchString) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?category=problems&resourceType=condition&searchString=${
          searchString ?? "abc"
        }`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=allergy&searchString=${
          searchString ?? "abe"
        }`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=allergy&dataField=reactions`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=allergy&dataField=severities`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=appointment&dataField=type`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=medicationstatement&searchString=${
          searchString ?? ""
        }`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=medicationstatement&dataField=reasons`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=immunization&searchString=${
          searchString ?? ""
        }`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          },
        }
      );
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
  getMedicationOrderData: async (searchString) => {
    try {
      let sourceType = localStorage.getItem("XCALIBER_SOURCE");
      let sourceUrl =
        sourceType === "EPIC"
          ? EPIC_XCHANGE_ENDPOINT
          : XCHANGE_SERVICE_ENDPOINT;
          console.log(localStorage.getItem("XCALIBER_SOURCE"),sourceUrl);
      const result = await axios.get(
        `${sourceUrl}/api/v1/ReferenceData?resourceType=medicationrequest&searchString=${
          searchString ?? ""
        }&dataField=order`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
