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
import { Loader2 } from "lucide-react";
import Logo from "../assets/Group.png";

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

const mapFHIRDataToForm = (data) => {
  if (!data) return {};

  const officialName = data.name?.find((n) => n.use === "official");

  return {
    // 🔹 Patient Information
    lastName: officialName?.family || "",
    firstName: officialName?.given?.join(" ") || "",
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

    // 🔹 Address
    address1: data.address?.[0]?.line?.[0] || "",
    city: data.address?.[0]?.city || "",
    state: data.address?.[0]?.state || "",
    postalCode: data.address?.[0]?.postalCode || "",

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
    rpCity:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.address?.[0]?.city || "",
    rpState:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.address?.[0]?.state || "",
    rpPostalCode:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.address?.[0]?.postalCode || "",
    rpPhone:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.telecom?.[0]?.value || "",
    rpRelation:
      data.contained?.find((c) => c.resourceType === "RelatedPerson")
        ?.relationship?.[0]?.text || "",
  };
};

const mapFHIRInsuranceDataToForm = (insuranceData) => {
  if (!insuranceData || !insuranceData.data || !insuranceData.data.entry) {
    return {};
  }

  const insuranceEntries = insuranceData.data.entry.map(
    (entry) => entry.resource
  );

  const getAddress = (extensions) => {
    const addressExt = extensions?.find(
      (ext) =>
        ext.url ===
        "http://xcaliber-fhir/structureDefinition/insurance-policy-holder-address"
    );
    if (addressExt?.valueAddress) {
      const { line, city, state, country, postalCode } =
        addressExt.valueAddress;
      return `${line?.join(
        ", "
      )}, ${city}, ${state}, ${country}, ${postalCode}`;
    }
    return "N/A";
  };

  const getSequenceNumber = (extensions) => {
    const seqExt = extensions?.find(
      (ext) =>
        ext.url === "http://xcaliber-fhir/structureDefinition/sequence-number"
    );
    return seqExt?.valueInteger || null;
  };

  let primaryInsurance = null;
  let secondaryInsurance = null;
  let availableInsurances = [];

  insuranceEntries.forEach((insurance) => {
    const sequenceNumber = getSequenceNumber(insurance.extension);
    if (sequenceNumber === 1) {
      primaryInsurance = insurance;
    } else if (sequenceNumber === 2) {
      secondaryInsurance = insurance;
    } else {
      availableInsurances.push(insurance);
    }
  });

  if (!primaryInsurance && availableInsurances.length > 0) {
    primaryInsurance = availableInsurances.shift();
  }

  if (!secondaryInsurance && availableInsurances.length > 0) {
    secondaryInsurance = availableInsurances.shift();
  }

  const mapInsuranceDetails = (insurance) => {
    if (!insurance) return null;

    return {
      insurerName: insurance.class?.[0]?.name || "N/A",
      insurerAddress: getAddress(insurance.policyHolder?.extension),
      groupNumber:
        insurance.identifier?.find((id) => id.system === "insurance-package-id")
          ?.value || "N/A",
      policyNumber:
        insurance.identifier?.find((id) => id.system === "insurance-id-number")
          ?.value || "N/A",
      insuredName: insurance.policyHolder?.display || "N/A",
      insuredRelation: insurance.relationship?.text || "N/A",
    };
  };

  return {
    primaryInsurerName: mapInsuranceDetails(primaryInsurance)?.insurerName,
    primaryInsurerAddress:
      mapInsuranceDetails(primaryInsurance)?.insurerAddress,
    primaryGroupNumber: mapInsuranceDetails(primaryInsurance)?.groupNumber,
    primaryPolicyNumber: mapInsuranceDetails(primaryInsurance)?.policyNumber,
    primaryInsuredName: mapInsuranceDetails(primaryInsurance)?.insuredName,
    primaryInsuredRelation:
      mapInsuranceDetails(primaryInsurance)?.insuredRelation,

    secondaryInsurerName: mapInsuranceDetails(secondaryInsurance)?.insurerName,
    secondaryInsurerAddress:
      mapInsuranceDetails(secondaryInsurance)?.insurerAddress,
    secondaryGroupNumber: mapInsuranceDetails(secondaryInsurance)?.groupNumber,
    secondaryPolicyNumber:
      mapInsuranceDetails(secondaryInsurance)?.policyNumber,
    secondaryInsuredName: mapInsuranceDetails(secondaryInsurance)?.insuredName,
    secondaryInsuredRelation:
      mapInsuranceDetails(secondaryInsurance)?.insuredRelation,
  };
};

const uiSchema = {
  "ui:options": { submitButtonOptions: { norender: true } },
  ...Object.keys(mapFHIRDataToForm({})).reduce((acc, key) => {
    acc[key] = { "ui:widget": CustomInput };
    return acc;
  }, {}),
};
const uiSchema2 = {
  "ui:options": { submitButtonOptions: { norender: true } },

  // 🔹 Primary Insurance Fields
  primaryInsurerName: { "ui:widget": CustomInput },
  primaryInsurerAddress: { "ui:widget": CustomInput },
  primaryGroupNumber: { "ui:widget": CustomInput },
  primaryPolicyNumber: { "ui:widget": CustomInput },
  primaryInsuredName: { "ui:widget": CustomInput },
  primaryInsuredRelation: { "ui:widget": CustomInput },

  // 🔹 Secondary Insurance Fields
  secondaryInsurerName: { "ui:widget": CustomInput },
  secondaryInsurerAddress: { "ui:widget": CustomInput },
  secondaryGroupNumber: { "ui:widget": CustomInput },
  secondaryPolicyNumber: { "ui:widget": CustomInput },
  secondaryInsuredName: { "ui:widget": CustomInput },
  secondaryInsuredRelation: { "ui:widget": CustomInput },
};

export default function PatientDetails({ patientId, departmentId, sourceId }) {
  const id = patientId;
  const [patientDetails, setPatientDetails] = useState(null);
  const [vitalDetails, setVitalDetails] = useState([]);
  const [insuranceDetails, setInsuranceDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(patientDetails);
  useEffect(() => {
    if (!id) return; // Prevent API calls if ID is undefined

    const getPatientDetails = async () => {
      try {
        const response = await PatientService.getPatientById(id);
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
        setInsuranceDetails(response);
      } catch (error) {
        console.error("Error fetching Insurance data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVitalsData = async () => {
      try {
        setLoading(true);
        const response = await fetchVitals(id, sourceId, departmentId);
        setVitalDetails(response);
      } catch (error) {
        console.error("Error fetching vitals data:", error);
      }
    };

    getPatientDetails();
    fetchInsurance();
    fetchVitalsData();
  }, [id]); // Only runs when a valid ID is available

  if (!patientDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="relative flex flex-col items-center">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="w-14 h-14 mb-4" />

          {/* Circular Loader */}
          <Loader2 className="animate-spin w-24 h-12 text-blue-600" />
        </div>
      </div>
    );
  }

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
              schema={{
                lastName: { type: "string", title: "Last Name" },
                firstName: { type: "string", title: "First Name" },
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
                city: { type: "string", title: "City" },
                state: { type: "string", title: "State" },
                postalCode: { type: "string", title: "Postal Code" },
              }}
              formData={mapFHIRDataToForm(patientDetails)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Accordions */}
      <div className="space-y-6 w-full">
        <Card className="max-w-full bg-[#F8FAFC] rounded-lg border-none shadow-none">
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <Accordion
                type="multiple"
                defaultValue={[]}
                collapsible
                className="space-y-4"
              >
                {/* Responsible Party / Guarantor */}
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
                        rpName: {
                          type: "string",
                          title: "Responsible Party Name",
                        },
                        rpPhone: { type: "string", title: "RP Phone" },
                        rpRelation: {
                          type: "string",
                          title: "Relation to Patient",
                        },
                        rpAddress1: {
                          type: "string",
                          title: "RP Address Line 1",
                        },
                        rpAddress2: {
                          type: "string",
                          title: "RP Address Line 2",
                        },
                        rpAddress3: {
                          type: "string",
                          title: "RP Address Line 3",
                        },
                      }}
                      formData={mapFHIRDataToForm(patientDetails)}
                      uiSchema={{
                        rpName: { "ui:widget": CustomInput },
                        rpPhone: { "ui:widget": CustomInput },
                        rpRelation: { "ui:widget": CustomInput },
                        rpAddress1: { "ui:widget": CustomInput },
                        rpAddress2: { "ui:widget": CustomInput },
                        rpAddress3: { "ui:widget": CustomInput },
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="PRIMARY INSURANCE"
                  className="border rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline bg-white py-4 px-6 transition-colors duration-300 data-[state=open]:bg-[#D1E9FF] rounded-md">
                    <h2 className="text-lg font-semibold text-[#0C4A6E]">
                      PRIMARY INSURANCE INFORMATION
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-white rounded-md">
                    {loading ? (
                      [...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse p-4 border border-gray-200 rounded-lg shadow-md bg-gray-100"
                        >
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      <SectionIns
                        schema={{
                          primaryInsurerName: {
                            type: "string",
                            title: "Primary Insurer Name",
                          },
                          primaryInsurerAddress: {
                            type: "string",
                            title: "Primary Insurer Address",
                          },
                          primaryGroupNumber: {
                            type: "string",
                            title: "Primary Group Number",
                          },
                          primaryPolicyNumber: {
                            type: "string",
                            title: "Primary Policy Number",
                          },
                          primaryInsuredName: {
                            type: "string",
                            title: "Primary Insured Name",
                          },
                          primaryInsuredRelation: {
                            type: "string",
                            title: "Insured Relation",
                          },
                        }}
                        formData={mapFHIRInsuranceDataToForm(insuranceDetails)}
                        uiSchema={uiSchema2} // ✅ FIXED
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Secondary Insurance */}
                {/* ✅ Secondary Insurance Accordion */}

                <AccordionItem
                  value="SECONDARY INSURANCE"
                  className="border rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline bg-white py-4 px-6 transition-colors duration-300 data-[state=open]:bg-[#D1E9FF] rounded-md">
                    <h2 className="text-lg font-semibold text-[#0C4A6E]">
                      SECONDARY INSURANCE INFORMATION
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-white rounded-md">
                    {loading ? (
                      [...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse p-4 border border-gray-200 rounded-lg shadow-md bg-gray-100"
                        >
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      ))
                    ) : (
                      <SectionIns
                        schema={{
                          secondaryInsurerName: {
                            type: "string",
                            title: "Secondary Insurer Name",
                          },
                          secondaryInsurerAddress: {
                            type: "string",
                            title: "Secondary Insurer Address",
                          },
                          secondaryGroupNumber: {
                            type: "string",
                            title: "Secondary Group Number",
                          },
                          secondaryPolicyNumber: {
                            type: "string",
                            title: "Secondary Policy Number",
                          },
                          secondaryInsuredName: {
                            type: "string",
                            title: "Secondary Insured Name",
                          },
                          secondaryInsuredRelation: {
                            type: "string",
                            title: "Insured Relation",
                          },
                        }}
                        formData={mapFHIRInsuranceDataToForm(insuranceDetails)}
                        uiSchema={uiSchema2} // ✅ Fixed: Explicitly passing correct uiSchema2
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

function Section({ title, schema, formData }) {
  return (
    <>
      {title && (
        <>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <Separator />
        </>
      )}
      <Form
        schema={{ type: "object", properties: schema }}
        formData={formData}
        uiSchema={uiSchema}
        validator={validator}
      />
    </>
  );
}
function SectionIns({ title, schema, formData }) {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <Separator />
      <Form
        schema={{ type: "object", properties: schema }}
        formData={formData}
        uiSchema={uiSchema2}
        validator={validator}
      />
    </>
  );
}

function VitalCard({ icon: Icon, label, value, color }) {
  const formattedLabel = label
    .replace(/^vitals\./i, "")
    .split(".")
    .join(" ");

  return (
    <Card>
      <CardContent className="p-4 h-full bg-white rounded-lg">
        <div className="flex items-center gap-2 w-full">
          <Icon className={`w-5 h-5 ${color}`} />
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm text-muted-foreground break-words">
              {formattedLabel}
            </p>
            <p className="text-xl font-semibold truncate">{value || "N/A"}</p>
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
  const [loadingVitals, setLoadingVitals] = useState(true);

  useEffect(() => {
    if (vitals.length > 0) {
      setLoadingVitals(false);
    }
  }, [vitals]);

  return (
    <>
      <h2 className="text-lg font-semibold mt-2">PATIENT'S RECENT VITALS</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loadingVitals ? (
          // ✅ Show Shimmer Effect while loading
          [...Array(5)].map((_, index) => <ShimmerVitalCard key={index} />)
        ) : vitals.length > 0 ? (
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
          // Show a message if no vitals available
          <p className="text-gray-500 col-span-full">No vitals available</p>
        )}
      </div>
    </>
  );
}

function ShimmerVitalCard() {
  return (
    <Card className="animate-pulse shadow-md rounded-lg">
      <CardContent className="p-4 h-full bg-white rounded-lg">
        <div className="flex flex-col gap-1 w-full">
          {/* Title (Simulating "Body mass index (BMI) [Ratio]") */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

          {/* Icon & Value Row */}
          <div className="flex items-center gap-2">
            {/* Placeholder for Icon */}
            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>

            {/* Placeholder for Value */}
            <div className="h-6 bg-gray-400 rounded w-1/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
