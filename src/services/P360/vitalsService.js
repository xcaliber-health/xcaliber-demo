import axios from "axios";
import { XCHANGE_SERVICE_ENDPOINT } from "../../core-utils/constants";

export const VitalsService = {
    getVitals: async (patientId) => {
        try {
            console.log("here id  : ", patientId);
            const response = await axios.get(
                `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Observation?patient=${patientId}&category=vital-signs`,
                {
                    headers: {
                        Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
                        "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
                        "Access-Control-Allow-Origin": "*",
                        "withCredentials": true,
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    },
                }
            );
            return response.data?.data?.entry;
        } catch (error) {
            console.log(error);
        }
    },
    createVitals: async (vitalsPayload) => {
        try {
            console.log(vitalsPayload);
            const response = await axios.post(
                `${XCHANGE_SERVICE_ENDPOINT}/api/v1/Observation`,
                vitalsPayload,
                {
                    headers: {
                        Authorization: `${process.env.REACT_APP_AUTHORIZATION}`,
                        "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
};