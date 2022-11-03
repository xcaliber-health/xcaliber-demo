import axios from "axios";
import { LENS_API_ENDPOINT } from "../../core-utils/constants";

export const AnalyticService = {
  discoverLens: async (payload) => {
    try {
      let url = `${LENS_API_ENDPOINT}/api/v1/datalenses/5197fc6c-b44a-4d94-87f0-9e09aa27bfc3/discover`;
      const response = await axios.post(url, JSON.parse(payload), {
        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`
        },
      });
      console.log(response);
      return response.data?.results?.slice(0, 2);
    } catch (error) {
      //Handle Exception
      console.log(error);
    }
  },
};
