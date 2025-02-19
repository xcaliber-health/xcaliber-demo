import axios from "axios";
import { Helper } from "../core-utils/helper";

export const InsuranceService = {
  getCoverage: async (patientId, departmentId) => {
    try {
      let sourceUrl = Helper.getSourceUrl();
      const response = await axios.get(
        `${sourceUrl}/Coverage?patient=${patientId}&departmentId=${departmentId}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "X-Source-Id": localStorage.getItem("XCALIBER_TOKEN"),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching coverage data:", error);
    }
  },
};
