import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const NoteService = {
  getVisitNotes: async (patientId) => {
    try {
      const response = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference?patient=${patientId}&type=visit-notes&_count=3`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return response.data?.data?.entry;
    } catch (error) {
      console.log(error);
    }
  },
  createNote: async (notePayload) => {
    try {
      console.log(notePayload);
      const response = await axios.post(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference?type=visit-notes`,
        notePayload,
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
