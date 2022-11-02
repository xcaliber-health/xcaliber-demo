import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const ReferenceDataService = {
  getProblemData: async (searchString) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?category=problems&resourceType=condition&searchString=${searchString ?? ""
        }`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
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
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/ReferenceData?resourceType=allergy&searchString=${searchString ?? ""
        }`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
          },
        }
      );
      console.log(result?.data?.data?.result);
      return result?.data?.data?.result;
    } catch (error) {
      console.log(error);
    }
  },
};
