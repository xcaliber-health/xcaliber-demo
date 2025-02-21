import { useEffect, useState } from "react";
import { LabOrderService } from "../services/labOrderService";
import { PractitionerService } from "../services/practitionerService";
import { ProblemService } from "../services/problemService";
import { ReferenceDataService } from "../services/referenceDataService";
import { LabResultsService } from "../services/labResultsService";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import { Label } from "./ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
export default function LabOrderForm({
  patientId,
  departmentId,
  encounterId,
  sourceId,
  practitionerId,
  practiceId,
}) {
  const [formData, setFormData] = useState({
    collectionDate: "",
    collectionTime: "",
    approvingProvider: "Ach, Chip",
    orderingProvider: "Ach, Chip",
    npi1: "",
    npi2: "",
    accountName: "",
    address: "",
    phone: "",
    noteToLab: "",
    internalNote: "",
    stat: false,
    standingOrder: false,
    publishResults: false,
    reference: "",
    problem: "",
    encounterDiagnosis: "",
    zip: "",
  });

  const [referenceOptions, setReferenceOptions] = useState([]);
  const [problemOptions, setProblemOptions] = useState([]);
  const [encounterDiagnosisOptions, setEncounterDiagnosisOptions] = useState(
    []
  );
  const [practitioners, setPractitioners] = useState([]);

  // ✅ Fetch Reference Data
  const fetchReferenceData = async () => {
    try {
      const response = await ReferenceDataService.getReferenceData(
        practiceId,
        sourceId
      );
      console.log("Reference Data Response:", response);

      if (response?.data?.result && Array.isArray(response.data.result)) {
        setReferenceOptions(response.data.result);
      } else {
        console.warn("API Response did not contain 'result' array.");
        setReferenceOptions([]);
      }
    } catch (error) {
      console.error("Error fetching reference data:", error);
      setReferenceOptions([]);
    }
  };

  // ✅ Combine Problems & Encounter Diagnosis in a Single Dropdown
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);

  // ✅ Fetch & Merge Problems + Encounter Diagnoses
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const problems = await ProblemService.getProblems(
          patientId,
          departmentId,
          sourceId
        );
        const diagnoses = await ProblemService.getDiagnosis(
          patientId,
          departmentId,
          sourceId,
          encounterId,
          practiceId
        );

        // ✅ Format & Merge Problems & Diagnoses
        const formattedProblems =
          problems?.map((item) => ({
            value: `${item.resource.code.coding[0].code}-${item.resource.id}`,
            label: `Problem: ${item.resource.code.coding[0].display}`,
          })) || [];

        const formattedDiagnoses =
          diagnoses?.map((item) => ({
            value: `${item.resource.code.coding[0].code}-${item.resource.id}`,
            label: `Diagnosis: ${item.resource.code.coding[0].display}`,
          })) || [];

        setDiagnosisOptions([...formattedDiagnoses, ...formattedProblems]);
      } catch (error) {
        console.error("Error fetching diagnosis data:", error);
        setDiagnosisOptions([]);
      }
    };

    if (patientId && sourceId) {
      fetchDiagnosisData();
    }
  }, [patientId, sourceId, departmentId, encounterId, practiceId]);

  // ✅ Fetch Practitioners based on Zipcode
  useEffect(() => {
    if (formData.zip && practiceId) {
      const fetchPractitioners = async () => {
        try {
          console.log("Fetching practitioners with zip:", formData.zip); // Debugging log

          const response = await PractitionerService.getPractitioners(
            "clinical-provider",
            "roc",
            formData.zip, // Ensure this is correct
            practiceId,
            sourceId
          );

          console.log("Fetched Practitioners:", response);
          setPractitioners(response || []);
        } catch (error) {
          console.error("Error fetching practitioners:", error);
          setPractitioners([]);
        }
      };
      fetchPractitioners();
    }
  }, [formData.zip, practiceId, sourceId]);

  // ✅ useEffect for Reference Data
  useEffect(() => {
    if (practiceId && sourceId) {
      fetchReferenceData();
    }
  }, [practiceId, sourceId]);

  // ✅ Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedOrderType = referenceOptions.find(
      (option) =>
        option.ordertypeid.toString() === formData.reference?.ordertypeid
    );

    const payload = {
      context: { departmentId: departmentId },
      data: {
        resourceType: "ServiceRequest",
        encounter: { reference: `Encounter/${encounterId}` },
        subject: { reference: `Patient/${patientId}` },
        contained: [],
        category: [
          {
            coding: [
              {
                system: "http://hl7.org/fhir/ValueSet/servicerequest-category",
                code: "108252007",
                display: "Lab",
              },
            ],
          },
          {
            text: selectedOrderType?.name || "Unknown Order Type",
            coding: [
              {
                system: "ATHENA",
                code: selectedOrderType?.ordertypeid || "Unknown Code",
                display: selectedOrderType?.name || "Unknown Order Type",
              },
            ],
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: parseInt(formData.problem),
                display:
                  diagnosisOptions.find((p) => p.value === formData.problem)
                    ?.label || "Unknown",
              },
            ],
          },
        ],
        priority: formData.stat ? "urgent" : "routine",
        authoredOn: new Date().toISOString(),
        requester: { reference: `Practitioner/${practitionerId}` },
        performer: [
          { reference: "Organization/10848074", display: "CVS/Pharmacy #5590" },
        ],
        status: "REVIEW",
      },
    };

    let payloadLabResult = {
      context: { departmentId: departmentId },
      data: {
        resourceType: "DiagnosticReport",

        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                code: "Lab",
              },
            ],
          },
          {
            coding: [
              {
                system: "athena",
                code: "LABRESULT",
                extension: [],
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "57021-8",
              display: "CBC w/ auto diff",
            },
          ],
          text: "CBC w/ auto diff",
        },
        subject: {
          reference: `Patient/${patientId}`,
        },
        conclusion:
          "The results of your recent lab tests are within normal limits. We look forward to seeing you at your next appointment.",
        text: {
          div: '{"performinglabcity":"New York","documentclass":"LABRESULT","priority":"2","labresultloinc":"57021-8","performinglabzip":"10021-0001","tietoorderid":143797,"lastmodifieddatetime":"2021-04-06T16:03:58-04:00","alarmdays":"14","departmentid":"150","observations":[],"providerid":67,"patientnote":"The results of your recent lab tests are within normal limits. We look forward to seeing you at your next appointment.","actionnote":"scrambled notes","createddatetime":"2020-06-23T08:01:59-04:00","createddate":"06/23/2020","performinglabaddress2":"suite 1","lastmodifieduser":"mheang","performinglabaddress1":"5 Hatley Road","pages":[],"documentsource":"UPLOAD","labresultid":143583,"status":"CLOSED","ordertype":"LAB","providerusername":"mblake1","resultcategory":"UNKNOWN","documenttypeid":342093,"portalpublisheddatetime":"2021-04-06T16:01:39-04:00","externalnoteonly":"The results of your recent lab tests are within normal limits. We look forward to seeing you at your next appointment.","documentroute":"RESULTSCALL","encounterdate":"06/23/2020","performinglabstate":"NY","description":"CBC w/ auto diff","facilityid":11309146,"lastmodifieddate":"04/06/2021","createduser":"sfeldman1","performinglabname":"7 Hills Department","isreviewedbyprovider":true}',
        },
        performer: [
          {
            reference: "Practitioner/67",
          },
        ],

        result: [],
        presentedForm: [
          {
            extension: [
              {
                url: "http://xcaliber-fhir/structureDefinition/created-date",
                valueDateTime: new Date().toISOString(),
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/status",
                valueString: "CLOSED",
              },
              {
                url: "http://xcaliber-fhir/structureDefinition/document-source",
                valueString: "UPLOAD",
              },
            ],
          },
        ],
        issued: new Date().toISOString(),
        extension: [
          {
            url: "http://xcaliber-fhir/structureDefinition/priority",
            valueString: "2",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/facility-id",
            valueInteger: 11309146,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/is-reviewed-by-provider",
            valueBoolean: true,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/created-user",
            valueString: "sfeldman1",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/department-id",
            valueString: "150",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/document-source",
            valueString: "UPLOAD",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/document-route",
            valueString: "RESULTSCALL",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/document-type-id",
            valueInteger: 342093,
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/encounter-date",
            valueDate: "2020-06-23",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/external-note-only",
            valueString:
              "The results of your recent lab tests are within normal limits. We look forward to seeing you at your next appointment.",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/last-modified-datetime",
            valueDateTime: "2021-04-06T16:03:58-04:00",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/last-modified-user",
            valueString: "mheang",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/order-type",
            valueString: "LAB",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/portal-published-datetime",
            valueDateTime: "2021-04-06T16:01:39-04:00",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/status",
            valueString: "CLOSED",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/alarm-days",
            valueString: "14",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/action-note",
            valueString: "scrambled notes",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/result-category",
            valueString: "UNKNOWN",
          },
          {
            url: "http://xcaliber-fhir/structureDefinition/provider-user-name",
            valueString: "mblake1",
          },
        ],
        contained: [
          {
            resourceType: "Organization",
            id: "195903",
            address: [
              {
                line: ["5 Hatley Road", "suite 1"],
                city: "New York",
                state: "NY",
                postalCode: "10021-0001",
              },
            ],
          },
        ],
      },
    };

    try {
      const response = await LabOrderService.createLabOrder(payload, sourceId);
      const basedOn = [
        {
          reference: `ServiceRequest/${response?.data.id || "UNKNOWN"}`,
        },
      ];
      payloadLabResult = { ...payloadLabResult, basedOn: basedOn };
      const responseLabResult = await LabResultsService.createLabResult(
        payloadLabResult,
        sourceId
      );
      console.log("Create Lab Order Response:", response);
      console.log("Create Lab Result Response:", responseLabResult);

      if (response.data.status === "success") {
        toast.success("Form submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // ✅ Handles form input changes
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">LAB ORDER DETAILS</h1>
        </div>

        <Label className="text-base">Select Receiver</Label>
        {/* Zipcode Input */}
        <div className="mt-4">
          <Label>Enter Zip Code</Label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            placeholder="Enter Zip Code"
            className="border px-4 py-2 w-full rounded-md"
          />
        </div>
        {/* Practitioners Dropdown */}
        <div className="mt-4">
          <Label>Select Practitioner</Label>
          {practitioners.length === 0 && !formData.zip ? (
            // ✅ Show a disabled input field with the text instead of the dropdown
            <input
              type="text"
              value="Enter a ZIP to see Practitioners"
              disabled
              className="border px-4 py-2 w-full rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          ) : (
            <Combobox
              label="Select a Practitioner"
              options={practitioners.map((p) => ({
                value: p.resource.id,
                label: p.resource.name?.[0]?.text || "Unknown Practitioner",
              }))}
              value={formData.orderingProvider}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, orderingProvider: value }))
              }
            />
          )}
        </div>

        <div className="border-b border-gray-300 my-5" />

        {/* Reference Dropdown */}
        <div>
          <Label className="text-base">Select Order Type</Label>
          <Label className="text-base">Select Order Type</Label>
          <Combobox
            label="Select a reference"
            options={referenceOptions.map((option) => ({
              value: option.ordertypeid.toString(), // Ensure this is a string
              label: option.name, // Display name correctly
            }))}
            value={
              formData.reference?.ordertypeid
                ? formData.reference.ordertypeid.toString()
                : ""
            } // Ensure value is set correctly
            onChange={(value) => {
              console.log("Selected Order Type ID:", value); // Debugging log
              const selectedOption = referenceOptions.find(
                (option) => option.ordertypeid.toString() === value
              );
              console.log("Selected Order Type Data:", selectedOption); // Debugging log

              if (selectedOption) {
                setFormData((prev) => ({
                  ...prev,
                  reference: {
                    ordertypeid: selectedOption.ordertypeid.toString(),
                    name: selectedOption.name,
                  },
                }));
              }
            }}
          />
        </div>

        <div className="mt-4">
          <Label className="text-base"> Select Problem or Diagnosis</Label>
          <Combobox
            label="Select a problem or diagnosis"
            options={diagnosisOptions}
            value={formData.problem}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, problem: value }))
            }
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="submit">
            SUBMIT ORDER
          </Button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
}
