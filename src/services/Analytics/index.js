import axios from "axios";
import { LENS_API_ENDPOINT } from "../../core-utils/constants";

export const AnalyticService = {
  getDataLenses: async () => {
    try {
      let url = `${LENS_API_ENDPOINT}/api/v1/datalenses`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(`Failed to get lenses from lens-svc: ${error}`);
    }
  },
  discoverLens: async (payload, lensId) => {
    try {
      let payload1 = { query: `${payload}` };
      let url = `${LENS_API_ENDPOINT}/api/v1/datalenses/${lensId}/discover`;
      const response = await axios.post(url, payload1, {
        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
        },
      });
      return response.data?.results;
    } catch (error) {
      //Handle Exception
      window.alert("Enter correct query");
      console.log(error);
    }
  },
  timeSeries: async (payload, lensId, start, end) => {
    try {
      let payload1 = { query: `${payload}`, start: `${start}`, end: `${end}` };
      let url = `${LENS_API_ENDPOINT}/api/v1/datalenses/${lensId}/timeseries`;
      const response = await axios.post(url, payload1, {
        headers: {
          Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
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
