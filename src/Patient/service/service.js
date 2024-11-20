import axios from "axios";
// import { format } from 'date-fns'
// import { TableData } from '../patients/search/ViewPatientsTable'
import moment from "moment";
import { range } from "lodash";
import { useMemo } from "react";
import {
  XCHANGE_SERVICE_ENDPOINT,
  EPIC_XCHANGE_ENDPOINT,
} from "../../core-utils/constants";
import { Helper } from '../../core-utils/helper';


const endpointUrl = "https://xchange-staging.xcaliberapis.com";

const dateParser = (item) => {
  var date = new Date(item);

  // var formattedDate = format(date, 'yyyy-mm-dd')
  var formattedDate = moment(date).format("YYYY-MM-DD");

  // let year = formattedDate.substring(0, 5)
  // let month = formattedDate.substring(5, 7)
  // if (parseInt(month) < 10) {
  //   month = '0' + (parseInt(month) + 1)
  // } else {
  //   month = '' + (parseInt(month) + 1)
  // }
  // let day = formattedDate.substring(7, 10)
  // let finalDate = year + month + day
  // console.log("finaldate",finalDate)
  return formattedDate;
};

export const deParsefunc = (item) => {
  let finalDate = dateParser(item.dateOfBirth);
  let tempObj;
  if (localStorage.getItem(`XCALIBER_SOURCE`) === "ELATION")
    tempObj = {
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        resourceType: "Patient",

        name: [
          {
            use: "official",
            family: item.familyName,
            given: [item.givenName, item.suffix],
            text: item.givenName + " " + item.suffix + " " + item.familyName,
          },
        ],
        identifier: [
          {
            type: {
              text: "ssn",
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                  code: "SS",
                },
              ],
            },
            system: "http://hl7.org/fhir/sid/us-ssn",
            value: null,
          },
        ],
        address: tableObjDeparser(item.addresses, "address"),
        birthDate: finalDate,
        gender: item.sex,
        generalPractitioner: [
          {
            reference: "Practitioner/140857915539458",
          },
        ],
        contact: [
          {
            name: {
              use: "official",
              family: "EmergencyLName",
              given: ["EmergencyFName", ""],
              text: "EmergencyFName EmergencyLName",
            },
            relationship: [
              {
                text: "Child",
                coding: [
                  {
                    code: "C",
                    display: "Emergency Contact",
                  },
                ],
              },
            ],
            telecom: [
              {
                system: "phone",
                value: "9876567898",
              },
            ],
            address: {
              line: ["test emergency address", "#456"],
              city: "test emergency city",
              state: "AL",
              postalCode: "98765",
            },
          },
        ],
        extension: [
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
            valueCode: "Male",
          },
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
            valueString: "Hispanic or Latino",
          },
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
            valueString: "Black or African American",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/gender-marker",
            valueString: "F",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/pronouns",
            valueString: "she_her_hers",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/sexual-orientation",
            valueString: "prefer_not_to_say",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/notes",
            valueString: "Test notes",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/provider.html",
            valueString: 140983539597314,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/provider-npi.html",
            valueString: "1730691296",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/master-patient",
            valueString: 141002016555288,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/created-date",
            valueString: "2022-09-28T08:07:14Z",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/practice",
            valueInteger: 140857911017476,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/modified-date",
            valueDateTime: "2022-09-28T08:07:14Z",
          },
        ],
        telecom: phnEmlParser(item.phoneNumbers, item.emails),
        meta: null,
        contained: [
          {
            resourceType: "RelatedPerson",
            id: 141002015965544,
            name: [
              {
                use: "official",
                family: "Test",
                given: ["Other", ""],
              },
            ],
            relationship: [
              {
                coding: [
                  {
                    code: "O",
                  },
                ],
                text: "Other",
              },
            ],
            address: [
              {
                line: ["101 Lane Street"],
                city: "Madison",
                state: "WI",
                postalCode: "53711",
              },
            ],
            telecom: [
              {
                value: "1231231233",
              },
            ],
          },
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  code: "eng",
                  system: "http://hl7.org/fhir/ValueSet/all-languages",
                },
              ],
            },
          },
        ],
      },
    };
  else {
    tempObj = {
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        resourceType: "Patient",
        name: [
          {
            use: "official",
            family: item.familyName,
            given: [item.givenName, item.suffix],
            text: item.givenName + " " + item.suffix + " " + item.familyName,
          },
        ],
        address: [
          {
            line: ["Test", ""],
            city: "TEST CITY",
            state: "CA",
            postalCode: "78987",
            country: "USA",
          },
        ],
        communication: [
          {
            language: {
              coding: [
                {
                  code: "eng",
                  system: "http://hl7.org/fhir/ValueSet/all-languages",
                },
              ],
            },
          },
        ],
        birthDate: finalDate,
        gender:
          item?.sex === "man"
            ? "Identifies as Male"
            : item?.sex === "woman"
            ? `Identifies as Female`
            : `Gender non-conforming (neither exclusively male nor female)`,
        maritalStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
              code: "S",
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
            telecom: [
              {
                system: "phone",
                use: "home",
              },
              {
                system: "phone",
                use: "mobile",
              },
            ],
          },
        ],
        extension: [
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
            extension: [
              {
                url: "text",
                valueString: "2165-9",
              },
            ],
          },
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
            extension: [
              {
                url: "text",
                valueCode: ["1987-7"],
              },
            ],
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/legal-sex",
            valueCode: "M",
          },
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
            valueCode: "M",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/consenttocall.html",
            valueBoolean: true,
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/countrycode3166.html",
            valueString: "US",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantoraddress1.html",
            valueString: "Test",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantorcity.html",
            valueString: "TEST CITY",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantorstate.html",
            valueString: "CA",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantorzip.html",
            valueString: "78987",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantorcountrycode3166.html",
            valueString: "US",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantorlastname.html",
            valueString: "App",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantorrelationshiptopatient.html",
            valueString: "32",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/guarantoraddresssameaspatient.html",
            valueString: true,
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/language6392code.html",
            valueString: "eng",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/preferredpronouns.html",
            valueString: "he/him",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/primarydepartmentid.html",
            valueString: "169",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/sexualorientation.html",
            valueString: "Choose not to disclose",
          },
          {
            url: "https://docs.xcaliberapis.com/xchange/elation/extensions/status.html",
            valueString: "active",
          },
        ],
        identifier: [
          {
            type: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                  code: "SS",
                },
              ],
            },
            system: "http://hl7.org/fhir/sid/us-ssn",
            value: "",
          },
        ],
        telecom: [
          {
            extension: [
              {
                url: "http://schemas.canvasmedical.com/fhir/extensions/has-consent",
                valueBoolean: true,
              },
            ],
            system: "phone",
            value: "8765434567",
            use: "home",
          },
          {
            extension: [
              {
                url: "http://schemas.canvasmedical.com/fhir/extensions/has-consent",
                valueBoolean: true,
              },
            ],
            system: "phone",
            value: "8765678767",
            use: "work",
          },
          {
            extension: [
              {
                url: "http://schemas.canvasmedical.com/fhir/extensions/has-consent",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_announcement_phone.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_announcement_sms.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_appointment_phone.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_appointment_sms.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_billing_phone.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_billing_sms.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_lab_phone.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_lab_sms.html",
                valueBoolean: true,
              },
            ],
            system: "phone",
            value: "8765434567",
            use: "mobile",
          },
          {
            extension: [
              {
                url: "http://schemas.canvasmedical.com/fhir/extensions/has-consent",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_announcement_email.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_appointment_email.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_billing_email.html",
                valueBoolean: true,
              },
              {
                url: "https://docs.xcaliberapis.com/xchange/elation/extensions/telecom/contactpreference_lab_email.html",
                valueBoolean: true,
              },
            ],
            system: "email",
            value: "test@gmail.com",
          },
        ],
        meta: null,
      },
    };
  }
  return tempObj;
};

export const tableObjParser = (dataM, type) => {
  let count = 1;
  let ads = [];
  if (type === "address") {
    dataM?.map((data) => {
      let adsObj = { id: "" + count, value: "", type: "home" };
      let ad = "";
      let line = data.line?.map((i) => {
        ad += i + " ";
      });
      adsObj.value = ad;
      ads.push(adsObj);
      count++;
    });
  } else if (type === "phone") {
    dataM?.map((data) => {
      if (data.system === "phone") {
        let phnObj = { id: "" + count, value: data.value, type: data.use };
        ads.push(phnObj);
      }
    });
  } else {
    dataM?.map((data) => {
      let emlObj = { id: "" + count, value: data.value, type: "mobile" };
      if (data.system === "email") {
        ads.push(emlObj);
      }
    });
  }

  return ads;
};

export const tableObjDeparser = (data, type) => {
  let ads = [];

  if (type === "address") {
    data?.map((item) => {
      let obj = { line: [], city: "Madison", state: "WI", postalCode: "53711" };
      obj.line[0] = item.value;
      obj.line[1] = " ";
      ads.push(obj);
    });
  }
  return ads;
};

export const phnEmlParser = (phnData, emlData) => {
  let ads = [];

  phnData?.map((item) => {
    let obj = { system: "phone", value: item.value, use: item.type };
    ads.push(obj);
  });

  emlData?.map((item) => {
    let obj = { system: "email", value: item.value };
    ads.push(obj);
  });

  return ads;
};


export const parserFunc = (data) => {
  let dataHolder = [];
  data?.map((item) => {
    let tempObj = {};
    tempObj.bloodType = "bloodType";
    tempObj.addresses = tableObjParser(item.resource.address, "address");
    tempObj.code = item.resource.id;
    tempObj.dateOfBirth = item.resource.birthDate;
    tempObj.familyName = item.resource.name[0].family;
    tempObj.fullName = item.resource.name[0].text;
    tempObj.givenName = item.resource.name[0].given[0];
    tempObj.suffix = item.resource.name[0].given[1];
    tempObj.id = item.resource.id;
    tempObj.sex = item.resource.gender;
    tempObj.type = "mockType";
    tempObj.extension = item.resource.extension;
    tempObj.gender = item.resource.gender;
    tempObj.email;
    tempObj.phone;
    item.resource?.telecom?.forEach((telecom) => {
      if(telecom?.system==='email'){
        tempObj.email = telecom?.value
      }
      else {
        tempObj.phone = telecom?.value
      }
    })
    dataHolder.push(tempObj);
  });
  return dataHolder;
};

const parserFuncSingle = (item) => {
  let tempObj = {};
  tempObj.bloodType = "bloodType";
  tempObj.addresses = tableObjParser(item.address, "address");
  tempObj.code = item.id;
  tempObj.dateOfBirth = item.birthDate;
  tempObj.familyName = item.name[0].family;
  tempObj.fullName = item.name[0].text;
  tempObj.givenName = item.name[0].given[0];
  tempObj.suffix = item.name[0].given[1];
  tempObj.id = item.id;
  tempObj.sex = item.gender;
  tempObj.type = "mockType";
  tempObj.phoneNumbers = tableObjParser(item.telecom, "phone");
  tempObj.emails = tableObjParser(item.telecom, "email");
  return tempObj;
};

export const getAllPatients = () => {
  let sourceUrl = Helper.getSourceUrl()

  const configHeaders = {
    headers: {
      Authorization: Helper.getSourceToken(),
      "x-source-id": localStorage.getItem("XCALIBER_TOKEN"),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };
  return axios
    .get(`${sourceUrl}/api/v1/Patient`, configHeaders)
    .then(async (response) => {
      const data = await response.data;
      const parsedData = parserFunc(data.data.entry);
      return parsedData;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPatientCount = async (name) => {
  try {
    // let sourceUrl = Helper.getSourceUrl()

    // const configHeaders = {
    //   headers: {
    //     Authorization: Helper.getSourceToken(),
    //     "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //   },
    // };
    // name = !name ? "" : name;
    // const response = await axios.get(
    //   `${sourceUrl}/api/v1/Patient?_count=1&_offset=0&name=${name}`,
    //   configHeaders
    // );
    return 1000;
    // const patients = response.data.data.total;
    // return patients;
  } catch (err) {
    console.log(err);
  }
};

export const getPatient = (id) => {
  let sourceUrl = Helper.getSourceUrl()
  const configHeaders = {
    headers: {
      Authorization: Helper.getSourceToken(),
      "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };
  return axios
    .get(`${sourceUrl}/api/v1/Patient/${id}`, configHeaders)
    .then(async (response) => {
      const data = await response.data;
      const parsedData = parserFuncSingle(data.data);
      return parsedData;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPatientsAtPage = (page, name) => {
  const patientIds = ["27895"];
  name = !name ? "" : name;
  const offset = page * 11 - 11;
  let sourceUrl = Helper.getSourceUrl()

  if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION")
    return axios
      .get(`${sourceUrl}/api/v1/Patient?_count=11&_offset=${offset}&name=${name}`, {
        headers: {
          Authorization: Helper.getSourceToken(),
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then(async (response) => {
        const data = await response.data;
        const parsedData = parserFunc(data.data.entry);
        return parsedData ? parsedData : [];
      })
      .catch((error) => {
        console.log(error);
      });
  else if (localStorage.getItem("XCALIBER_SOURCE") === "ATHENA") {
    name = 'william';
    return axios
      .get(
        `${sourceUrl}/api/v1/Patient?departmentId=${localStorage.getItem(
          `DEPARTMENT_ID`
        )}&_count=11&_offset=${offset}&name=${name}`,
        {
          headers: {
            Authorization: Helper.getSourceToken(),
            "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      .then(async (response) => {
        const data = await response.data;
        const parsedData = parserFunc(data.data.entry);
        for (var i = 0; i < patientIds.length; i++) {
          const dum = await PatientsById(patientIds[i]);
          parsedData?.push(...dum);
        }
        return parsedData ? parsedData : [];
      })
      .catch(async (error) => {
        if (
          error.response?.data.issue[0].details.text ===
          '{"error":"The given search parameters would produce a total data set larger than 1000 records.  Please refine your search and try again."}'
        ) {
          let sourceUrl = Helper.getSourceUrl();
          return await axios
            .get(
              `${sourceUrl}/api/v1/Patient?departmentId=${localStorage.getItem(
                `DEPARTMENT_ID`
              )}&_count=10&_offset=${offset}&given=George&name=${name}`,
              {
                headers: {
                  Authorization: Helper.getSourceToken(),
                  "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods":
                    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
              }
            )
            .then(async (response) => {
              const data = await response.data;
              const parsedData = parserFunc(data.data.entry);
              for (var i = 0; i < patientIds.length; i++) {
                const dum = await PatientsById(patientIds[i]);
                parsedData?.push(...dum);
              }
              return parsedData ? parsedData : [];
            });
        }
      });
  }
  else if (localStorage.getItem("XCALIBER_SOURCE") === "EPIC")
    return axios
      .get(`${sourceUrl}/api/v1/Patient?_count=11&_offset=${offset}&name=${name}`, {
        headers: {
          Authorization: Helper.getSourceToken(),
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((response) => {
        const data = response.data;
        const parsedData = parserFunc(data.data.entry);
        return parsedData ? parsedData : [];
      })
      .catch((error) => {
        console.log(error);
      });
  else if (localStorage.getItem("XCALIBER_SOURCE") === "ECW")
    return axios
      .get(`${sourceUrl}/hp/fhir-gateway/fhir/R4/Patient?_count=11&_offset=${offset}${ name && '&name=' + name}`, {
        headers: {
          Authorization: Helper.getSourceToken(),
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((response) => {
        const data = response.data;
        const parsedData = parserFunc(data.entry);
        return parsedData ? parsedData : [];
      })
      .catch((error) => {
        console.log(error);
      });
};

export const PatientsById = (id) => {
  if (
    localStorage.getItem("XCALIBER_SOURCE") === "ATHENA" &&
    localStorage.getItem(`DEPARTMENT_ID`) == 150
  ) {
    return axios
      .get(`${endpointUrl}/api/v1/Patient/${id}`, {
        headers: {
          Authorization: Helper.getSourceToken(),
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then(async (response) => {
        const data = await response.data;
        const parsedData = parserFunc([{ resource: data.data }]);
        return parsedData ? parsedData : [];
      })
      .catch((error) => {
        console.log(error);
      });
  }
  else if(localStorage.getItem("XCALIBER_SOURCE") === "EPIC") {
    let sourceUrl = Helper.getSourceUrl();
    return axios
      .get(`${sourceUrl}/api/v1/Patient/${id}`, {
        headers: {
          Authorization: Helper.getSourceToken(),
          "x-source-id": `${localStorage.getItem("XCALIBER_TOKEN")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then(async (response) => {
        const data = await response.data;
        const parsedData = parserFunc([{ resource: data.data }]);
        return parsedData ? parsedData : [];
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return [];
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
    .post(`${sourceUrl}/api/v1/Patient`, d, configHeaders)
    .then(async (response) => {
      const data = await response;
      return data.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const editPatient = (patient, id) => {
  let sourceUrl = Helper.getSourceUrl();
  let d = deParsefunc(patient);
  const configHeaders = {
    headers: {
      Authorization: Helper.getSourceToken(),
      "x-source-id": `${process.env.REACT_APP_XSOURCEID}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };

  return axios
    .put(`${sourceUrl}/api/v1/Patient/${id}`, d, configHeaders)
    .then(async (response) => {
      const data = await response;

      return data.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) => {
  const DOTS = "...";
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
      Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
      Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
      Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
      Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    } else {
      return [];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
