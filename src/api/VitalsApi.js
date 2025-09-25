
import { fhirFetch } from "./fhir";

// ✅ GET Vitals (Observations)
export async function fetchVitals(patientId, departmentId, sourceId) {
  return fhirFetch(`/Observation?patient=${patientId}&departmentId=${departmentId}`, {
    sourceId,
    headers: { "x-interaction-mode": "false" },
  });
}

// ✅ POST Create Vitals (Observation)
export async function createVitals(patientId, departmentId, sourceId, values) {
  const now = new Date().toISOString();

  const observation = {
    resourceType: "Observation",
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "vital-signs",
            display: "Vital Signs",
          },
        ],
      },
    ],
    code: { coding: [{ code: "85354-9", display: "Blood pressure panel" }] }, // Parent BP code
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime: now,
    issued: now,
    component: [],
  };

  // Blood Pressure components
  const systolic = Number(values.systolic);
  const diastolic = Number(values.diastolic);
  if (!isNaN(systolic) || !isNaN(diastolic)) {
    if (!isNaN(systolic)) {
      observation.component.push({
        code: { coding: [{ code: "8480-6", display: "Systolic Blood Pressure" }] },
        valueQuantity: { value: systolic, unit: "mmHg" },
      });
    }
    if (!isNaN(diastolic)) {
      observation.component.push({
        code: { coding: [{ code: "8462-4", display: "Diastolic Blood Pressure" }] },
        valueQuantity: { value: diastolic, unit: "mmHg" },
      });
    }
  }

  // Other vitals
  const heightInches = (Number(values.heightFt) || 0) * 12 + (Number(values.heightIn) || 0);
  if (heightInches > 0) {
    observation.component.push({
      code: { coding: [{ code: "8302-2", display: "Body Height" }] },
      valueQuantity: { value: heightInches, unit: "in" },
    });
  }

  const weight = Number(values.weight);
  if (!isNaN(weight) && weight > 0) {
    observation.component.push({
      code: { coding: [{ code: "29463-7", display: "Body Weight" }] },
      valueQuantity: { value: weight, unit: "lbs" },
    });
  }

  const bmi = Number(values.bmi);
  if (!isNaN(bmi) && bmi > 0) {
    observation.component.push({
      code: { coding: [{ code: "39156-5", display: "Body Mass Index" }] },
      valueQuantity: { value: bmi, unit: "kg/m2" },
    });
  }

  const pulse = Number(values.pulse);
  if (!isNaN(pulse) && pulse > 0) {
    observation.component.push({
      code: { coding: [{ code: "8867-4", display: "Heart Rate" }] },
      valueQuantity: { value: pulse, unit: "bpm" },
    });
  }

  const temp = Number(values.temperature);
  if (!isNaN(temp) && temp > 0) {
    observation.component.push({
      code: { coding: [{ code: "8310-5", display: "Body Temperature" }] },
      valueQuantity: { value: temp, unit: "°F" },
    });
  }

  const respiration = Number(values.respiration);
  if (!isNaN(respiration) && respiration > 0) {
    observation.component.push({
      code: { coding: [{ code: "9279-1", display: "Respiratory Rate" }] },
      valueQuantity: { value: respiration, unit: "bpm" },
    });
  }

  // POST request
  return fhirFetch(`/Observation?departmentId=${departmentId}`, {
    sourceId,
    method: "POST",
    headers: { "Content-Type": "application/fhir+json" },
    body: JSON.stringify(observation),
  });
}
