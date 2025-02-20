import { Badge } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Combobox } from "./ui/combobox";
import { ReferenceDataService } from "../services/referenceDataService";
import { ProblemService } from "../services/problemService";
import { LabOrderService } from "../services/labOrderService";

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
    problem: "", // ✅ Stores selected problem
    encounterDiagnosis: "", // ✅ Stores selected encounter diagnosis
  });

  const [referenceOptions, setReferenceOptions] = useState([]);
  const [problemOptions, setProblemOptions] = useState([]);
  const [encounterDiagnosisOptions, setEncounterDiagnosisOptions] = useState(
    []
  ); // ✅ New state for encounter diagnosis

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

  // ✅ Fetch Problem Data (Ensure Unique Keys)
  const fetchProblemData = async () => {
    try {
      const response = await ProblemService.getProblems(
        patientId,
        "problem-list-item",
        departmentId,
        sourceId
      );
      console.log("Problem Data Response:", response);

      if (response && Array.isArray(response)) {
        const formattedProblems = response
          .map((item) => {
            if (item.resource?.code?.coding?.length > 0) {
              return {
                value: `${item.resource.code.coding[0].code}-${item.resource.id}`, // ✅ Ensure uniqueness
                label:
                  item.resource.code.coding[0].display || "Unknown Problem",
              };
            }
            return null;
          })
          .filter(Boolean); // Remove null values if any

        console.log("Formatted Problem Options:", formattedProblems); // 🔍 Debug Log
        setProblemOptions(formattedProblems);
      } else {
        console.warn("API Response did not contain expected structure.");
        setProblemOptions([]);
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
      setProblemOptions([]);
    }
  };

  // ✅ Fetch Encounter Diagnosis Data (Ensure Unique Keys)
  const fetchEncounterDiagnosisData = async () => {
    try {
      const response = await ProblemService.getDiagnosis(
        patientId,
        departmentId,
        sourceId,
        encounterId,
        practiceId
      );
      console.log("Encounter Diagnosis Data Response:", response);

      if (response && Array.isArray(response)) {
        const formattedDiagnoses = response
          .map((item) => {
            if (item.resource?.code?.coding?.length > 0) {
              return {
                value: `${item.resource.code.coding[0].code}-${item.resource.id}`, // ✅ Ensure uniqueness
                label:
                  item.resource.code.coding[0].display || "Unknown Diagnosis",
              };
            }
            return null;
          })
          .filter(Boolean); // Remove null values if any

        console.log(
          "Formatted Encounter Diagnosis Options:",
          formattedDiagnoses
        ); // 🔍 Debug Log
        setEncounterDiagnosisOptions(formattedDiagnoses);
      } else {
        console.warn("API Response did not contain expected structure.");
        setEncounterDiagnosisOptions([]);
      }
    } catch (error) {
      console.error("Error fetching encounter diagnosis data:", error);
      setEncounterDiagnosisOptions([]);
    }
  };

  // ✅ useEffect for Reference Data
  useEffect(() => {
    if (practiceId && sourceId) {
      fetchReferenceData();
    }
  }, [practiceId, sourceId]);

  // ✅ useEffect for Problem Data
  useEffect(() => {
    if (patientId && sourceId) {
      fetchProblemData();
    }
  }, [patientId, sourceId]);

  // ✅ useEffect for Encounter Diagnosis Data
  useEffect(() => {
    if (patientId && sourceId) {
      fetchEncounterDiagnosisData();
    }
  }, [patientId, sourceId]);

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
            coding: [
              {
                code: 342223,
                display: "Lab",
                system: "ATHENA",
              },
            ],
            text: "CMP, serum or plasma",
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: formData.problem,
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
                code: formData.encounterDiagnosis,
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
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">LAB ORDER DETAILS</h1>
        </div>

        {/* Reference Dropdown */}
        <div>
          <Label>Select Order Type</Label>
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

        {/* ✅ Problem Selection Dropdown */}
        <div className="mt-4">
          <Label>Select Problem</Label>
          <Combobox
            label="Select a problem"
            options={problemOptions}
            value={formData.problem}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, problem: value }))
            }
          />
        </div>

        {/* ✅ Encounter Diagnosis Selection Dropdown */}
        <div className="mt-4">
          <Label>Select Encounter Diagnosis</Label>
          <Combobox
            label="Select a diagnosis"
            options={encounterDiagnosisOptions}
            value={formData.encounterDiagnosis}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, encounterDiagnosis: value }))
            }
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="submit">
            SUBMIT ORDER
          </Button>
        </div>
      </form>
    </Card>
  );
}
