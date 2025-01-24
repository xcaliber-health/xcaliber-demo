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

const formatPhoneNumber = (number: string): string | null => {
  // Ensure the phone number follows NANP
  const match = number.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return null; 
};

export const phnEmlParser = (phnData, emlData) => {
  let parsedTelecom = [];

  // Parse and format phone numbers
  phnData?.forEach((item) => {
    if (item.value) {
      const formattedNumber = formatPhoneNumber(item.value);
      if (formattedNumber) {
        parsedTelecom.push({
          system: "phone",
          value: formattedNumber,
          use: item.type || "home", 
        });
      }
    }
  });

  // Parse email addresses
  emlData?.forEach((item) => {
    if (item.value) {
      parsedTelecom.push({
        system: "email",
        value: item.value,
      });
    }
  });

  return parsedTelecom;
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

export const addPatient = (patient) => {
  let sourceUrl = Helper.getSourceUrl();
  let d = deParsefunc(patient);
  const configHeaders = {
    headers: {
      Authorization: Helper.getSourceToken(),
      "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };
  console.log(d);
  return axios
    .post(`${sourceUrl}/Patient`, d, configHeaders)
    .then(async (response) => {
      const data = await response;
      return data.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const dateParser = (item: string): string => {
  if (!item) return "";
  const date = new Date(item);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const tableObjDeparser = (data, type) => {
  let parsedData = [];

  if (type === "address") {
    data?.forEach((item) => {
      let addressObj = {
        line: [item.value || ""],
        city: item.city || "",
        state: item.state || "",
        postalCode: item.postalCode || "",
        country: item.country || "USA", 
      };
      parsedData.push(addressObj);
    });
  }
  return parsedData;
};


export const deParsefunc = (item) => {
  const finalDate = item.dateOfBirth || "";

  // Function to format phone numbers
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/[^\d]/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
  };

  // Helper function to safely parse addresses
  const parseAddress = (address, city, state, postalCode, country) => {
    return {
      line: address ? [address.trim()] : [],
      city: city || "",
      state: state || "",
      postalCode: postalCode || "",
      country: country || "USA", // Default to USA if not provided
    };
  };

  // Parse the main address
  const mainAddress = parseAddress(item.address, item.city, item.state, item.postalCode, item.country);

  // Parse the emergency contact address
  const emergencyContactAddress = parseAddress(
    item.emergencyContactAddress,
    item.emergencyContactCity || "",
    item.emergencyContactState || "",
    item.emergencyContactPostalCode || "",
    item.emergencyContactCountry || "USA"
  );

  // Debugging logs
  console.log("Parsed Main Address:", mainAddress);
  console.log("Parsed Emergency Contact Address:", emergencyContactAddress);

  return {
    context: {
      departmentId: localStorage.getItem("DEPARTMENT_ID"),
    },
    data: {
      resourceType: "Patient",
      name: [
        {
          use: "official",
          family: item.familyName,
          given: [item.givenName, item.middleName || ""],
          text: `${item.givenName} ${item.middleName || ""} ${item.familyName}`,
        },
        {
          use: "old",
          given: [item.givenName, item.middleName],
        },
      ],
      communication: [
        {
          language: {
            coding: [
              {
                system: "http://hl7.org/fhir/ValueSet/all-languages",
                code: item.primaryLanguage || "en",
              },
            ],
          },
        },
      ],
      address: [mainAddress],
      birthDate: finalDate,
      gender: item.sex,
      maritalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
            code: "UNK",
            display: "unknown",
          },
        ],
      },
      generalPractitioner: [
        {
          reference: "Practitioner/89",
        },
      ],
      contact: [
        {
          name: {
            text: item.emergencyContactName || "",
          },
          relationship: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/3.1.0/CodeSystem-v2-0131.html",
                  code: "EP",
                  display: item.emergencyContactRelationship || "Spouse",
                },
              ],
            },
          ],
          telecom: [
            {
              system: "phone",
              value: formatPhoneNumber(item.emergencyContactPhone) || "",
              use: "home",
            },
          ],
          address: emergencyContactAddress,
        },
      ],
      extension: [
        {
          url: "http://xcaliber-fhir/structureDefinition/legal-sex",
          valueCode: item.sex === "Male" ? "M" : "F",
        },
        {
          url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
          valueCode: item.sex === "Male" ? "M" : "F",
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/country-code",
          valueString: "USA",
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/notes",
          valueString: item.notes || "",
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/portal-access-given",
          valueBoolean: true,
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/preferred-pronouns",
          valueString: "he/him",
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/primary-department-id",
          valueString: "150",
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/referral-source-id",
          valueString: "1",
        },
      ],
      telecom: [
        ...(Array.isArray(item.phoneNumbers)
          ? item.phoneNumbers.map((phone) => ({
              system: "phone",
              value: formatPhoneNumber(phone.value),
              use: phone.type || "home",
            }))
          : item.phone
          ? [
              {
                system: "phone",
                value: formatPhoneNumber(item.phone),
                use: "home",
              },
            ]
          : []),
        ...(Array.isArray(item.emails)
          ? item.emails.map((email) => ({
              system: "email",
              value: email.value,
            }))
          : item.email
          ? [
              {
                system: "email",
                value: item.email,
              },
            ]
          : []),
      ],
    },
  };
};

export const editPatient = (patient, id) => {
  let sourceUrl = Helper.getSourceUrl();
  let d = deParsefunc(patient);
  console.log("Deparsed Patient Data:", d); 
  
  const source = localStorage.getItem("XCALIBER_SOURCE"); 
  let xSourceId;

  switch (source) {
    case "ATHENA":
      xSourceId = process.env.NEXT_PUBLIC_ATHENA_XSOURCEID;
      break;
    case "EPIC":
      xSourceId = process.env.NEXT_PUBLIC_EPIC_XSOURCEID;
      break;
    case "ECW":
      xSourceId = process.env.NEXT_PUBLIC_ECW_XSOURCEID;
      break;
    default:
      xSourceId = process.env.NEXT_PUBLIC_XSOURCEID; 
  }

  const configHeaders = {
    headers: {
      Authorization: Helper.getSourceToken(),
      "x-source-id": xSourceId,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };

  // Make the API call
  return axios
    .put(`${sourceUrl}/Patient/${id}`, d, configHeaders)
    .then(async (response) => {
      const data = await response;
      return data.data.data;
    })
    .catch((error) => {
      console.error("Error updating patient:", error.response?.data || error);
    });
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
