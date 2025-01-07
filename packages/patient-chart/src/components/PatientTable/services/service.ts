import axios from "axios";
// import { format } from 'date-fns'
// import { TableData } from '../patients/search/ViewPatientsTable'
import { Helper } from "../../../core-utils/helper";

const endpointUrl = "https://xchange-staging.xcaliberapis.com";

interface ContactInfo {
  id: string;
  value: string;
  type: string;
}

export const tableObjParser = (
  dataM: any[] | undefined,
  type: string
): ContactInfo[] => {
  if (!dataM) return [];

  let count = 1;
  const results: ContactInfo[] = [];

  if (type === "address") {
    dataM.forEach((data) => {
      if (!data.line) return;

      const address = data.line.join(" ").trim();
      if (address) {
        results.push({
          id: String(count++),
          value: address,
          type: "home",
        });
      }
    });
  } else if (type === "phone") {
    dataM.forEach((data) => {
      if (data.system === "phone") {
        results.push({
          id: String(count++),
          value: data.value,
          type: data.use || "home",
        });
      }
    });
  } else if (type === "email") {
    dataM.forEach((data) => {
      if (data.system === "email") {
        results.push({
          id: String(count++),
          value: data.value,
          type: "mobile",
        });
      }
    });
  }

  return results;
};

interface PatientResource {
  id: string;
  birthDate: string;
  name: Array<{
    family: string;
    text: string;
    given: string[];
  }>;
  gender: string;
  extension: any;
  address: any[];
  telecom?: Array<{
    system: string;
    value: string;
  }>;
}

interface PatientData {
  resource: PatientResource;
}

interface Patient {
  bloodType: string;
  addresses: ContactInfo[];
  code: string;
  dateOfBirth: string;
  familyName: string;
  fullName: string;
  givenName: string;
  suffix: string;
  id: string;
  sex: string;
  type: string;
  extension: any;
  gender: string;
  email?: string;
  phone?: string;
}

export const parserFunc = (data: PatientData[] | undefined): Patient[] => {
  if (!data) return [];

  return data
    .map((item) => {
      const resource = item.resource;
      if (!resource || !resource.name?.[0]) return null;

      const name = resource.name[0];
      const patient: Patient = {
        bloodType: "bloodType",
        addresses: tableObjParser(resource.address, "address"),
        code: resource.id,
        dateOfBirth: resource.birthDate,
        familyName: name.family,
        fullName: name.text,
        givenName: name.given?.[0] || "",
        suffix: name.given?.[1] || "",
        id: resource.id,
        sex: resource.gender,
        type: "mockType",
        extension: resource.extension,
        gender: resource.gender,
        email: undefined,
        phone: undefined,
      };

      resource.telecom?.forEach((telecom) => {
        if (telecom?.system === "email") {
          patient.email = telecom.value;
        } else if (telecom?.system === "phone") {
          patient.phone = telecom.value;
        }
      });

      return patient;
    })
    .filter((patient): patient is Patient => patient !== null);
};

const getCommonHeaders = () => ({
  Authorization: Helper.getSourceToken(),
  "x-source-id": localStorage.getItem("XCALIBER_TOKEN") || "",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
});

export const PatientsById = async (id: string): Promise<Patient[]> => {
  const source = localStorage.getItem("XCALIBER_SOURCE");
  const departmentId = Number(localStorage.getItem("DEPARTMENT_ID"));

  try {
    if (source === "ATHENA" && departmentId === 150) {
      const response = await axios.get(`${endpointUrl}/api/v1/Patient/${id}`, {
        headers: getCommonHeaders(),
      });
      return parserFunc([{ resource: response.data.data }]);
    }

    if (source === "EPIC") {
      const sourceUrl = Helper.getSourceUrl();
      const response = await axios.get(`${sourceUrl}/Patient/${id}`, {
        headers: getCommonHeaders(),
      });
      return parserFunc([{ resource: response.data.data }]);
    }

    return [];
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    return [];
  }
};

interface PaginationConfig {
  pageSize: number;
  defaultSearchName?: string;
  additionalPatientIds?: string[];
}

const DEFAULT_CONFIG: PaginationConfig = {
  pageSize: 11,
  additionalPatientIds: ["27895"],
};

export const getPatientsAtPage = async (
  page: number,
  name: string,
  config: PaginationConfig = DEFAULT_CONFIG
): Promise<Patient[]> => {
  const source = localStorage.getItem("XCALIBER_SOURCE");
  const sourceUrl = Helper.getSourceUrl();
  const offset = (page - 1) * config.pageSize;
  const searchName = name || "";

  try {
    switch (source) {
      case "ELATION": {
        const response = await axios.get(
          `${sourceUrl}/Patient?_count=${config.pageSize}&_offset=${offset}&name=${searchName}`,
          { headers: getCommonHeaders() }
        );
        return parserFunc(response.data.data.entry);
      }

      case "ATHENA": {
        const departmentId = localStorage.getItem("DEPARTMENT_ID");
        try {
          const response = await axios.get(
            `${sourceUrl}/Patient?departmentId=${departmentId}&_count=${config.pageSize}&_offset=${offset}&name=${searchName}`,
            { headers: getCommonHeaders() }
          );
          const parsedData = parserFunc(response.data.data.entry) || [];

          // Fetch additional patients if configured
          if (config.additionalPatientIds?.length) {
            const additionalPatients = await Promise.all(
              config.additionalPatientIds.map((id) => PatientsById(id))
            );
            parsedData.push(...additionalPatients.flat());
          }

          return parsedData;
        } catch (error: any) {
          if (
            error.response?.data.issue?.[0]?.details?.text?.includes(
              "larger than 1000 records"
            )
          ) {
            const fallbackResponse = await axios.get(
              `${sourceUrl}/Patient?departmentId=${departmentId}&_count=${config.pageSize}&_offset=${offset}&given=George&name=${searchName}`,
              { headers: getCommonHeaders() }
            );
            const parsedData =
              parserFunc(fallbackResponse.data.data.entry) || [];

            if (config.additionalPatientIds?.length) {
              const additionalPatients = await Promise.all(
                config.additionalPatientIds.map((id) => PatientsById(id))
              );
              parsedData.push(...additionalPatients.flat());
            }

            return parsedData;
          }
          throw error;
        }
      }

      case "EPIC": {
        const response = await axios.get(
          `${sourceUrl}/Patient?_count=${config.pageSize}&_offset=${offset}&name=${searchName}`,
          { headers: getCommonHeaders() }
        );
        return parserFunc(response.data.data.entry);
      }

      case "ECW": {
        const response = await axios.get(
          `${sourceUrl}/Patient?_count=${config.pageSize}&_offset=${offset}${searchName ? `&name=${searchName}` : ""}`,
          { headers: getCommonHeaders() }
        );
        return parserFunc(response.data.entry);
      }

      default:
        return [];
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};