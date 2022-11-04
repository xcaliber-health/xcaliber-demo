import axios from "axios";
import { LENS_API_ENDPOINT } from "../../core-utils/constants";

export const AnalyticService = {
  discoverLens: async (payload) => {
    try {
      let payload1 = { "query": `${payload}` }
      let url = `${LENS_API_ENDPOINT}/api/v1/datalenses/5197fc6c-b44a-4d94-87f0-9e09aa27bfc3/discover`;
      const response = await axios.post(url, payload1, {

        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`
        },
      });
      return response.data?.results;
    } catch (error) {
      //Handle Exception
      window.alert("Enter correct query");
      console.log(error);
    }
  },
};
