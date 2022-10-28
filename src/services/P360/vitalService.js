import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const VitalService = {
  getVitals: async (patientId) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Observation?_count=3&patient=${patientId}&category=vital-signs&departmentId=1`,
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
};
