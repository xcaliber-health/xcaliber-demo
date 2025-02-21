import { useEffect, useState } from "react";
import { LabOrderService } from "../services/labOrderService";
import { PractitionerService } from "../services/practitionerService";
import { ProblemService } from "../services/problemService";
import { ReferenceDataService } from "../services/referenceDataService";
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

        setDiagnosisOptions([...formattedProblems, ...formattedDiagnoses]);
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
            text: "CMP, serum or plasma",
            coding: [
              {
                system: "ATHENA",
                code: 342223,
                display: "Lab",
              },
            ],
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: parseInt(formData.problem), // ✅ Ensuring it's an integer.
                display:
                  problemOptions.find((p) => p.value === formData.problem)
                    ?.label || "Unknown",
              },
            ],
          },
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: parseInt(formData.encounterDiagnosis), // ✅ Ensuring it's an integer.
                display:
                  encounterDiagnosisOptions.find(
                    (d) => d.value === formData.encounterDiagnosis
                  )?.label || "Unknown",
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

    try {
      const response = await LabOrderService.createLabOrder(payload, sourceId);
      console.log("Create Lab Order Response:", response);

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
        {/* Zipcode Input */}
        <p className="text-base">
          <strong>Select Receiver</strong>
        </p>
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

        <div className="border-b border-gray-300 my-5"></div>

        {/* Reference Dropdown */}
        <div>
          <Label className="text-base">Select Order Type</Label>
          <Combobox
            label="Select a reference"
            options={referenceOptions.map((option) => ({
              value: option.ordertypeid.toString(),
              label: option.name,
            }))}
            value={formData.reference}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, reference: value }))
            }
          />
        </div>

        <div className="mt-4">
          <Label className="text-base">Select Problem or Diagnosis</Label>
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
