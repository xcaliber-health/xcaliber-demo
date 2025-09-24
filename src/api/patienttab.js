
import { useContext, useMemo } from "react";
import { AppContext } from "../layouts/DashboardLayout";

export const usePatientTabs = () => {
  const { departmentId } = useContext(AppContext);

  return useMemo(() => ({
    vitals: {
      label: "Vitals",
      headers: ["Date", "Type", "Value", "Unit"],
      url: (id) => `/Observation?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (obs) => {
        if (!obs.component?.length) return [];
        return obs.component.map((comp) => {
          const type = comp.code?.coding?.[0]?.display;
          const value = comp.valueQuantity?.value;
          const unit = comp.valueQuantity?.unit;
          const date = obs.issued ? new Date(obs.issued).toLocaleString() : null;
          return [date, type, value, unit].filter(Boolean);
        },[departmentId]);
      },
    },

    allergies: {
      label: "Allergies",
      headers: [
        "Allergy",
        "Category",
        "Clinical Status",
        "Criticality",
        "Onset Date",
        "Reactions",
      ],
      url: (id) => `/AllergyIntolerance?departmentId=${departmentId}&patient=${id}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const row = [];
        const allergy = res.code?.coding?.[0]?.display;
        if (allergy) row.push(allergy);
        if (res.category?.[0]) row.push(res.category[0]);
        const status = res.clinicalStatus?.coding?.[0]?.display;
        if (status) row.push(status);
        if (res.criticality) row.push(res.criticality);
        if (res.onsetDateTime) row.push(new Date(res.onsetDateTime).toLocaleDateString());
        if (res.reaction?.length) {
          const reactions = res.reaction
            .map((r) => r.manifestation?.[0]?.coding?.[0]?.display)
            .filter(Boolean)
            .join(", ");
          if (reactions) row.push(reactions);
        }
        return row;
      },
    },

    immunizations: {
      label: "Immunizations",
      headers: ["Vaccine", "Date", "Status"],
      url: (id) => `/Immunization?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const row = [];
        const vaccine = res.vaccineCode?.coding?.[0]?.display;
        if (vaccine) row.push(vaccine);
        if (res.occurrenceDateTime)
          row.push(new Date(res.occurrenceDateTime).toLocaleDateString());
        if (res.status) row.push(res.status);
        return row;
      },
    },

    diagnosticReports: {
      label: "Diagnostic Reports",
      headers: ["Report", "Status", "Date"],
      url: (patientId, category = "lab-results") =>
        `/DiagnosticReport?patient=${patientId}&departmentId=${departmentId}&category=${category}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const report = res.code?.text || res.code?.coding?.[0]?.display;
        const status = res.status;
        const date = res.effectiveDateTime
          ? new Date(res.effectiveDateTime).toLocaleDateString()
          : null;
        return [report, status, date].filter(Boolean);
      },
      categoryOptions: ["imaging-result", "lab-results"],
    },

    serviceRequests: {
      label: "Service Requests",
      headers: ["Code", "Status", "Intent"],
      url: (id) => `/ServiceRequest?patient=${id}&departmentId=${departmentId}&categorycode=lab_order_category_code&encounter=47219`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => [res.code?.text, res.status, res.intent].filter(Boolean),
    },

    documents: {
      label: "Documents",
      headers: ["Type", "Date", "Status"],
      url: (patientId, category = "VisitNotes") =>
        `/DocumentReference?patient=${patientId}&departmentId=${departmentId}&category=${category}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) =>
        [res.type?.text, res.date && new Date(res.date).toLocaleDateString(), res.status].filter(
          Boolean
        ),
      categoryOptions: [
        "VisitNotes",
        "appointment-request",
        "surgical-results",
        "letter",
        "interpretation",
        "phone-message",
        "unknown",
        "physician-auth",
        "html",
        "rto",
        "medical-record",
        "order",
        "admin",
        "encounter-document",
        "surgery",
        "clinical-document",
        "vaccine",
        "patient-case",
        "patient-record",
        "prescriptionResults",
      ],
    },

    encounters: {
      label: "Encounters",
      headers: ["Type", "Status", "Start", "End", "Practitioner", "Last Updated"],
      url: (id) => `/Encounter?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const type = res.class?.display;
        const status =
          res.extension?.find(
            (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/status"
          )?.valueString;
        const start = res.period?.start ? new Date(res.period.start).toLocaleString() : null;
        const end = res.period?.end ? new Date(res.period.end).toLocaleString() : null;
        const practitionerFirst =
          res.extension?.find(
            (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/provider-first-name"
          )?.valueString;
        const practitionerLast =
          res.extension?.find(
            (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/provider-last-name"
          )?.valueString;
        const practitioner = [practitionerFirst, practitionerLast].filter(Boolean).join(" ");
        const lastUpdated =
          res.extension?.find(
            (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/last-updated"
          )?.valueDate || res.meta?.lastUpdated;
        const lastUpdatedFormatted = lastUpdated ? new Date(lastUpdated).toLocaleString() : null;

        return [type, status, start, end, practitioner, lastUpdatedFormatted].filter(Boolean);
      },
    },

    conditions: {
      label: "Conditions",
      headers: ["Condition", "Clinical Status", "Onset"],
      url: (id) => `/Condition?patient=${id}&departmentId=${departmentId}&category=problem-list-item`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const conditionName = res.code?.coding?.[0]?.display;
        const clinicalStatus =
          res.extension?.find(
            (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/status"
          )?.valueString || res.status;
        const onsetDate =
          res.extension?.find(
            (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/on-set-date"
          )?.valueDateTime || res.onsetDateTime;
        return [conditionName, clinicalStatus, onsetDate && new Date(onsetDate).toLocaleDateString()].filter(
          Boolean
        );
      },
    },

    tasks: {
  label: "Tasks",
  headers: ["Description", "Status", "Intent"],
  // ✅ url needs patientId + dept + practitioner
  url: (id) =>
    `/Task?patient=${id}&departmentId=${departmentId}&practitioner=67`,
  headersConfig: { "x-interaction-mode": "true" },
  mapRow: (res) => [
    res.description || res.code?.coding?.[0]?.display, // fallback if description missing
    res.status,
    res.intent,
  ].filter(Boolean),
},


    // familyHistory: {
    //   label: "Family History",
    //   headers: ["Relation", "Condition"],
    //   url: (id) => `/FamilyMemberHistory?patient=${id}&departmentId=${departmentId}`,
    //   headersConfig: { "x-interaction-mode": "true" },
    //   mapRow: (res) => [
    //     res.relationship?.text,
    //     res.condition?.map((c) => c.code?.text).filter(Boolean).join(", "),
    //   ].filter(Boolean),
    // },
    familyHistory: {
  label: "Family History",
  headers: ["Relation", "Condition"],
  url: (id) => `/FamilyMemberHistory?patient=${id}&departmentId=${departmentId}`, 
  headersConfig: { "x-interaction-mode": "true" },
  mapRow: (res) => [
    res.relationship?.coding?.[0]?.display || "-",
    res.condition
      ?.map((c) => c.code?.coding?.map((code) => code.display).filter(Boolean).join(", "))
      .filter(Boolean)
      .join("; ") || "-",
  ],
},


    questionnaireResponses: {
      label: "Questionnaire Responses",
      headers: ["History Type", "Status", "Authored", "Rank"],
      url: (id) =>
        `/QuestionnaireResponse?patient=${id}&departmentId=${departmentId}&category=medical-history`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const row = [];
        const historyType = res.extension?.find(
          (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/category"
        )?.valueString;
        if (historyType) row.push(historyType);
        if (res.status) row.push(res.status);
        if (res.meta?.lastUpdated) row.push(new Date(res.meta.lastUpdated).toLocaleDateString());
        const rank = res.extension?.find(
          (ext) => ext.url === "http://xcaliber-fhir/structureDefinition/rank"
        )?.valueString;
        if (rank) row.push(rank);
        return row;
      },
    },

    medications: {
      label: "Medications",
      headers: ["Medication", "Status"],
      url: (id) => `/MedicationStatement?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => [res.medicationCodeableConcept?.text, res.status].filter(Boolean),
    },

    procedures: {
      label: "Procedures",
      headers: ["Procedure", "Status", "Date"],
      url: (id) => `/Procedure?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => {
        const row = [];
        const procedure = res.code?.coding?.[0]?.display;
        if (procedure) row.push(procedure);
        if (res.status) row.push(res.status);
        if (res.performedDateTime) row.push(new Date(res.performedDateTime).toLocaleDateString());
        return row;
      },
    },

    basics: {
      label: "Basic Records",
      headers: ["Code", "Created"],
      url: (patientId, code) =>
        `/Basic?patient=${patientId}&departmentId=${departmentId}${code ? `&code=${code}` : ""}`,
      headersConfig: { "x-interaction-mode": "true" },
      mapRow: (res) => [
        res.code?.text,
        res.created ? new Date(res.created).toLocaleDateString() : null,
      ].filter(Boolean),
      codeOptions: ["risk-contract", "other-code1", "other-code2"],
    },
  }), [departmentId]);
};
