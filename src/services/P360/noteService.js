import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const NoteService = {
  getVisitNotes: async (patientId) => {
    try {
      const response = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference?patient=${patientId}&type=visit-notes&_count=3&departmentId=1`,
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
      return response.data?.data?.id;
    } catch (error) {
      console.log(error);
    }
  },
  getVisitNoteById: async (noteId) => {
    try {
      const result = await axios.get(
        `${XCHANGE_SERVICE_ENDPOINT}/api/v1/DocumentReference/${noteId}?type=visit-notes`,
        {
          headers: {
            Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
            "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );
      return result?.data?.data;
    } catch (error) {
      console.log(error);
    }
  },
};
