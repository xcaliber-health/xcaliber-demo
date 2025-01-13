import axios from "axios";
import { Helper } from "../core-utils/helper";

export const CareTeamService = {
  getCareTeamList: async (patientId) => {
    try {
      const sourceUrl = Helper.getSourceUrl();
      const token = Helper.getSourceToken();

      const response = await axios.get(
        `${sourceUrl}/CareTeam?patient=Patient/${patientId}&departmentId=${localStorage.getItem(`DEPARTMENT_ID`)}`,
        {
          headers: {
            Authorization: token,
            "X-Source-Id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (
        !response?.data?.data?.entry ||
        response.data.data.entry.length === 0
      ) {
        console.log("No care team data found for the given patient.");
        return [];
      }

      const careTeamList = response.data.data.entry.map((item) => {
        const resource = item?.resource;

        if (!resource) {
          console.log("Entry resource is null or undefined.");
          return null;
        }

        return {
          resourceType: resource.resourceType || "Unknown",
          subject: resource.subject || "N/A",
          contained: resource.contained || "N/A",
          participant: resource.participant || [],
        };
      });

      return careTeamList.filter((team) => team !== null);
    } catch (error) {
      console.error("Error fetching care team list:", error);
    }
  },
};
