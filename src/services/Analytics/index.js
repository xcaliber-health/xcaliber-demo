import axios from "axios";
import { LENS_API_ENDPOINT } from "../../core-utils/constants";

export const AnalyticService = {
  discoverLens: async (select = "", where = "") => {
    try {
      let payload = {
        select: select !== "" && select ? select : "",
        where: where !== "" && where ? where : "",
      };
      let url = `${LENS_API_ENDPOINT}/api/v1/datalens/5197fc6c-b44a-4d94-87f0-9e09aa27bfc3/discover`;
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
          "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
        },
      });
      return response.data?.results;
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
};
