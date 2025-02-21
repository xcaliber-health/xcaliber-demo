import axios from "axios";
// import { format } from 'date-fns'
// import { TableData } from '../patients/search/ViewPatientsTable'
import { Helper } from "../../../core-utils/helper";


export const tableObjParser = (dataM, type) => {
  if (!dataM) return [];

  let count = 1;
  const results = [];

  if (type === "address") {
    dataM.forEach((data) => {
      if (!data.line) return;

      const address = data.line.join(" ").trim();
      if (address) {
        results.push({
          id: count++,
          value: address,
          type: "home",
        });
      }
    });
  } else if (type === "phone") {
    dataM.forEach((data) => {
      if (data.system === "phone") {
        results.push({
          id: count++,
          value: data.value,
          type: data.use || "home",
        });
      }
    });
  } else if (type === "email") {
    dataM.forEach((data) => {
      if (data.system === "email") {
        results.push({
          id: count++,
          value: data.value,
          type: "mobile",
        });
      }
    });
  }

  return results;
};

export const parserFunc = (data) => {
  if (!data) return [];

  return data
    .map((item) => {
      const resource = item.resource;
      if (!resource || !resource.name?.[0]) return null;

      const name = resource.name[0];
      const patient = {
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
    .filter((patient) => patient !== null);
};

const formatPhoneNumber = (number) => {
  if (!number) return null;

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

export const PatientsById = async (id) => {
  const source = localStorage.getItem("XCALIBER_SOURCE");
  const departmentId = Number(localStorage.getItem("DEPARTMENT_ID"));

  try {
    const sourceUrl = Helper.getSourceUrl();
    if (source === "ATHENA" && departmentId === 150) {
      const response = await axios.get(`${sourceUrl}/api/v1/Patient/${id}`, {
        headers: getCommonHeaders(),
      });
      return parserFunc([{ resource: response.data.data }]);
    }

    if (source === "EPIC") {
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

export const getPractitionerData = () => {
  const sourceUrl = Helper.getSourceUrl();
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
      "Content-Type": "application/json",
    },
  };

  // Make the API call
  return axios
    .get(`${sourceUrl}/Practitioner`, configHeaders)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error fetching practitioner data:",
        error.response?.data || error
      );
      throw error;
    });
};

const dateParser = (item) => {
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
    return phone
      .replace(/[^\d]/g, "")
      .replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
  };

  // Helper function to parse addresses
  const parseAddress = (address) => {
    if (!address)
      return { line: [], city: "", state: "", postalCode: "", country: "USA" };
    const parts = address.split(",").map((part) => part.trim());
    const [line, city, stateZip, country] = [
      parts[0],
      parts[1],
      parts.slice(2, -1).join(" "), // Combine the state and postal code
      parts[parts.length - 1],
    ];
    const [state, postalCode] =
      stateZip.split(" ").length > 1 ? stateZip.split(" ") : [stateZip, ""];
    return {
      line: [line],
      city: city || "",
      state: state || "",
      postalCode: postalCode || "",
      country: country || "USA",
    };
  };

  // Parse main and emergency contact addresses
  const mainAddress = parseAddress(item.address);
  const emergencyContactAddress = parseAddress(item.emergencyContact?.address);

  return {
    context: {
      departmentId: localStorage.getItem("DEPARTMENT_ID") || "150", // Default to 150
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
                code: "deu",
              },
            ],
          },
        },
      ],
      address: [mainAddress],
      birthDate: finalDate,
      gender: item.gender || undefined,
      maritalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
            code: "UNK",
            display: "unknown",
          },
        ],
      },
      generalPractitioner: item.practitioner
        ? [
            {
              reference: `Practitioner/${item.practitioner}`,
            },
          ]
        : undefined,
      contact: [
        {
          name: {
            text: item.emergencyContact?.name || "",
          },
          relationship: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/3.1.0/CodeSystem-v2-0131.html",
                  code: "EP",
                  display: item.emergencyContact?.relationship || "Spouse",
                },
              ],
            },
          ],
          telecom: [
            {
              system: "phone",
              value: formatPhoneNumber(item.emergencyContact?.phone) || "",
              use: "home",
            },
          ],
          address: emergencyContactAddress,
        },
      ],
      extension: [
        {
          url: "http://xcaliber-fhir/structureDefinition/legal-sex",
          valueCode:
            item.gender === "Male" ? "M" : item.gender === "Female" ? "F" : "O",
        },
        {
          url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
          valueCode:
            item.gender === "Male" ? "M" : item.gender === "Female" ? "F" : "O",
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
          valueString:
            item.gender === "Male"
              ? "he/him"
              : item.gender === "Female"
              ? "she/her"
              : "they/them",
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
        ...(item.phoneNumbers?.map((phoneObj) => ({
          system: "phone",
          value: formatPhoneNumber(phoneObj.value),
          use: phoneObj.type || "home",
        })) || []),
        ...(item.emails?.map((emailObj) => ({
          system: "email",
          value: emailObj.value,
        })) || []),
      ],
    },
  };
};

const DEFAULT_CONFIG = {
  pageSize: 11,
  additionalPatientIds: ["27895"],
};

export const getPatientsAtPage = async (
  page,
  name,
  config = DEFAULT_CONFIG
) => {
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
        } catch (error) {
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
          `${sourceUrl}/Patient?_count=${config.pageSize}&_offset=${offset}${
            searchName ? `&name=${searchName}` : ""
          }`,
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
