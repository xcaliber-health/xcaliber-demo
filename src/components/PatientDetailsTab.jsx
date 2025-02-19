import { useEffect, useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Activity, Heart, Ruler, Thermometer, Weight } from "lucide-react";
import { fetchVitals } from "./utils/getPatientVitals";
import { InsuranceService } from "../services/insuranceService";
import { PatientService } from "../services/patientService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

// ✅ Custom ShadCN UI Input Field for RJSF
const CustomInput = ({ id, value }) => (
  <Input
    id={id}
    value={value || ""} // Ensure default value is an empty string
    readOnly
    className="w-full bg-gray-50 border-2 border-gray-100 shadow-[0px_1px_2px_rgba(0,0,0,0.07)] 
                 rounded-md text-gray-800 py-3 mb-4 mt-1 text-lg transition-all duration-300 
                 cursor-not-allowed font-medium
                 "
  />
);

// ✅ Map API Data to Form Structure
const mapFHIRDataToForm = (data) => {
  // console.log(data)
  if (!data) return {};

  return {
    // 🔹 Patient Information
    patientName: data.name?.find((n) => n.use === "official")?.text || "",
    gender:
      data.extension?.find((ext) => ext.url.includes("legal-sex"))?.valueCode ||
      "",
    race:
      data.extension
        ?.find((ext) => ext.url.includes("us-core-race"))
        ?.extension?.find((e) => e.url.includes("us-core-race"))?.valueCode ||
      "",
    ethnicity:
      data.extension
        ?.find((ext) => ext.url.includes("us-core-ethnicity"))
        ?.extension?.find((e) => e.url.includes("us-core-ethnicity"))
        ?.valueCode || "",
    maritalStatus: data.maritalStatus?.coding?.[0]?.display || "",
    preferredPronouns:
      data.extension?.find((ext) => ext.url.includes("preferred-pronouns"))
        ?.valueString || "",
    departmentID:
      data.extension?.find((ext) => ext.url.includes("department-id"))
        ?.valueInteger || "",
    veteranStatus:
      data.extension?.find((ext) => ext.url.includes("veteran"))?.valueString ||
      "",
    ssn:
      data.extension?.find((ext) => ext.url.includes("ssn"))?.valueString || "",
    address1: data.address?.[0]?.line?.[0] || "",
    address2: data.address?.[0]?.city || "",
    address3:
      `${data.address?.[0]?.state}, ${data.address?.[0]?.postalCode}` || "",
    patientId: data.id || "",
    dateOfBirth: data.birthDate || "",
    phone: data.telecom?.find((t) => t.system === "phone")?.value || "",

    // 🔹 Responsible Party (Guarantor)
    rpName:
      data.contained
        ?.find((c) => c.resourceType === "RelatedPerson")
        ?.name?.[0]?.given?.join(" ") +
        " " +
        data.contained?.find((c) => c.resourceType === "RelatedPerson")
          ?.name?.[0]?.family || "",
    rpAddress1:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.address?.[0]?.line?.[0] || "",
    rpAddress2:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.address?.[0]?.city || "",
    rpAddress3:
      `${
        data.contained?.find((c) => c.resourceType === "RelatedPerson")
          ?.address?.[0]?.state
      }, ` +
        `${
          data.contained?.find((c) => c.resourceType === "RelatedPerson")
            ?.address?.[0]?.postalCode
        }` || "",
    rpPhone:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.telecom?.[0]?.value || "",
    rpRelation:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.relationship?.[0]?.text || "",

    // 🔹 Primary Insurance
    primaryInsurerName: data?.entry?.[0]?.resource?.class?.[0]?.name || "N/A",
    primaryInsurerAddress:
      data?.policyHolder?.extension
        ?.find((ext) => ext.url?.includes("insurance-policy-holder-address"))
        ?.valueAddress?.line?.join(", ") || "N/A",
    primaryGroupNumber:
      data?.identifier?.find((id) => id.system?.includes("insurance-id-number"))
        ?.value || "N/A",
    primaryPolicyNumber:
      data?.identifier?.find((id) =>
        id.system?.includes("insurance-package-id")
      )?.value || "N/A",
    primaryInsuredName:
      data?.policyHolder?.extension
        ?.find((ext) => ext.url?.includes("policy-holder/name"))
        ?.valueHumanName?.given?.join(" ") +
        " " +
        data?.policyHolder?.extension?.find((ext) =>
          ext.url?.includes("policy-holder/name")
        )?.valueHumanName?.family || "N/A",
    primaryInsuredRelation: data?.relationship?.text || "N/A",

    // 🔹 Secondary Insurance
    secondaryInsurerName: data?.class?.[0]?.name || "N/A",
    secondaryInsurerAddress:
      data?.policyHolder?.extension
        ?.find((ext) => ext.url?.includes("insurance-policy-holder-address"))
        ?.valueAddress?.line?.join(", ") || "N/A",
    secondaryGroupNumber:
      data?.identifier?.find((id) => id.system?.includes("insurance-id-number"))
        ?.value || "N/A",
    secondaryPolicyNumber:
      data?.identifier?.find((id) =>
        id.system?.includes("insurance-package-id")
      )?.value || "N/A",
    secondaryInsuredName:
      data?.policyHolder?.extension
        ?.find((ext) => ext.url?.includes("policy-holder/name"))
        ?.valueHumanName?.given?.join(" ") +
        " " +
        data?.policyHolder?.extension?.find((ext) =>
          ext.url?.includes("policy-holder/name")
        )?.valueHumanName?.family || "N/A",
    secondaryInsuredRelation: data?.relationship?.text || "N/A",
  };
};

// ✅ UI Schema (Removes Form Titles)
const uiSchema = {
  "ui:options": { submitButtonOptions: { norender: true } },
  ...Object.keys(mapFHIRDataToForm({})).reduce((acc, key) => {
    acc[key] = { "ui:widget": CustomInput };
    return acc;
  }, {}),
};

export default function PatientDetails({ patientId, departmentId, sourceId }) {
  const id = patientId;
  const [patientDetails, setPatientDetails] = useState(null);
  const [vitalDetails, setVitalDetails] = useState([]);
  const [insuranceDetails, setInsuranceDetails] = useState([]);

  useEffect(() => {
    if (!id) return; // Prevent API calls if ID is undefined

    const getPatientDetails = async () => {
      try {
        const response = await PatientService.getPatientById(id);
        console.log("Fetched Patient Data:", response); // ✅ Debugging log
        setPatientDetails(response);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    const fetchInsurance = async () => {
      try {
        const response = await InsuranceService.getCoverage(
          id,
          departmentId,
          sourceId
        );
        console.log("Fetched Insurance:", insuranceDetails);
        setInsuranceDetails(response);
      } catch (error) {
        console.error("Error fetching Insurance data:", error);
      }
    };

    const fetchVitalsData = async () => {
      try {
        const response = await fetchVitals(id, sourceId, departmentId);
        console.log("Fetched Vitals:", response);
        setVitalDetails(response);
      } catch (error) {
        console.error("Error fetching vitals data:", error);
      }
    };

    getPatientDetails();
    fetchInsurance();
    fetchVitalsData();
  }, [id]); // Only runs when a valid ID is available

  if (!patientDetails) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 p-4">
  {/* Left Side Fixed Card (Patient Details) */}
  <div className="lg:sticky lg:top-4">
    <Card className="bg-white rounded-lg border shadow-md p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          PATIENT DETAILS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Section
          title="Patient Information"
          schema={{
            patientName: { type: "string", title: "Patient Name" },
            gender: { type: "string", title: "Gender" },
            dateOfBirth: { type: "string", title: "Date of Birth" },
            phone: { type: "string", title: "Phone Number" },
          }}
          formData={mapFHIRDataToForm(patientDetails)}
        />
        <Section
          title="Address Information"
          schema={{
            address1: { type: "string", title: "Address Line 1" },
            address2: { type: "string", title: "Address Line 2" },
            address3: { type: "string", title: "Address Line 3" },
          }}
          formData={mapFHIRDataToForm(patientDetails)}
        />
      </CardContent>
    </Card>
  </div>

  {/* Right Side - Accordions */}
  <div className="space-y-6 w-full">
    <Card className="max-w-full bg-[#F8FAFC] rounded-lg border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          DETAILS :
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <Accordion type="multiple" className="space-y-4">
            {/* Responsible Party Accordion */}
            <AccordionItem
              value="RESPONSIBLE PARTY"
              className="border rounded-lg shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline bg-white py-4 px-6 transition-colors duration-300 data-[state=open]:bg-[#D1E9FF] rounded-md">
                <h2 className="text-lg font-semibold text-[#0C4A6E]">
                  RESPONSIBLE PARTY / GUARANTOR
                </h2>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-white rounded-md">
                <Section
                  schema={{
                    rpName: { type: "string", title: "Responsible Party Name" },
                    rpPhone: { type: "string", title: "RP Phone" },
                    rpRelation: { type: "string", title: "Relation to Patient" },
                    rpAddress1: { type: "string", title: "RP Address Line 1" },
                    rpAddress2: { type: "string", title: "RP Address Line 2" },
                    rpAddress3: { type: "string", title: "RP Address Line 3" },
                  }}
                  formData={mapFHIRDataToForm(patientDetails)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Right Column - Insurance Accordions */}
          <div className="space-y-6">
            <Accordion type="multiple" className="space-y-4">
              {/* Primary Insurance */}
              <AccordionItem value="PRIMARY INSURANCE" className="border rounded-lg shadow-sm">
                <AccordionTrigger className="hover:no-underline bg-white py-4 px-6 transition-colors duration-300 data-[state=open]:bg-[#D1E9FF] rounded-md">
                  <h2 className="text-lg font-semibold text-[#0C4A6E]">
                    PRIMARY INSURANCE INFORMATION
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white rounded-md">
                  <Section
                    schema={{
                      primaryInsurerName: { type: "string", title: "Primary Insurer Name" },
                      primaryInsurerAddress: { type: "string", title: "Primary Insurer Address" },
                      primaryGroupNumber: { type: "string", title: "Primary Group Number" },
                      primaryPolicyNumber: { type: "string", title: "Primary Policy Number" },
                      primaryInsuredName: { type: "string", title: "Primary Insured Name" },
                      primaryInsuredRelation: { type: "string", title: "Insured Relation" },
                    }}
                    formData={mapFHIRDataToForm(insuranceDetails)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Secondary Insurance */}
              <AccordionItem value="SECONDARY INSURANCE" className="border rounded-lg shadow-sm">
                <AccordionTrigger className="hover:no-underline bg-white py-4 px-6 transition-colors duration-300 data-[state=open]:bg-[#D1E9FF] rounded-md">
                  <h2 className="text-lg font-semibold text-[#0C4A6E]">
                    SECONDARY INSURANCE INFORMATION
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white rounded-md">
                  <Section
                    schema={{
                      secondaryInsurerName: { type: "string", title: "Secondary Insurer Name" },
                      secondaryInsurerAddress: { type: "string", title: "Secondary Insurer Address" },
                      secondaryGroupNumber: { type: "string", title: "Secondary Group Number" },
                      secondaryPolicyNumber: { type: "string", title: "Secondary Policy Number" },
                      secondaryInsuredName: { type: "string", title: "Secondary Insured Name" },
                      secondaryInsuredRelation: { type: "string", title: "Insured Relation" },
                    }}
                    formData={mapFHIRDataToForm(insuranceDetails)}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <Separator />

        {/* Recent Vitals */}
        <RecentVitals vitals={vitalDetails} />
      </CardContent>
    </Card>
  </div>
</div>

  );
}

// ✅ Reusable Form Section Component
function Section({ title, schema, formData }) {
  console.log(formData);
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <Separator />
      <Form
        schema={{ type: "object", properties: schema }}
        formData={formData}
        uiSchema={uiSchema}
        validator={validator}
      />
    </>
  );
}

function VitalCard({ icon: Icon, label, value, color }) {
  return (
    <Card>
      <CardContent className="pt-6 h-full bg-white rounded-lg">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold">{value || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const vitalIcons = {
  "BLOOD PRESSURE": Activity,
  "Body mass index (BMI) [Ratio]": Heart,
  "Body height": Ruler,
  "Body weight": Weight,
  "Respiratory rate": Thermometer,
};

const vitalColors = {
  "BLOOD PRESSURE": "text-blue-500",
  "Body mass index (BMI) [Ratio]": "text-red-500",
  "Body height": "text-orange-500",
  "Body weight": "text-green-500",
  "Respiratory rate": "text-red-500",
};

export function RecentVitals({ vitals }) {
  return (
    <>
      {/* Recent Vitals Section */}
      <h2 className="text-lg font-semibold  mt-2">PATIENT'S RECENT VITALS</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {vitals.length > 0 ? (
          vitals.map((vital) => (
            <VitalCard
              key={vital.measurement}
              icon={vitalIcons[vital.measurement] || Activity} // Default icon
              label={vital.measurement}
              value={vital.value}
              color={vitalColors[vital.measurement] || "text-gray-500"} // Default color
            />
          ))
        ) : (
          <p className="text-gray-500">No vitals available</p>
        )}
      </div>
    </>
  );
}
