import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const NoteService = {
  getVisitNotes: async (patientId) => {
    try {
      const response = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}//api/v1/DocumentReference?patient=140919926030337&type=visit-notes&_count=3`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
