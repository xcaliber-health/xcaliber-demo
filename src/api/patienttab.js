
import { useContext, useMemo } from "react";
import { AppContext } from "../layouts/DashboardLayout";

export const usePatientTabs = () => {
  const { departmentId  } = useContext(AppContext);

  return useMemo(() => ({
    

    vitals: {
      label: "Vitals",
    },
    
    allergies: {
      label: "Allergies",
    },

    immunizations: {
      label: "Immunizations",
    },

    
    diagnosticReports: {
      label: "Diagnostic Reports",
      headers: ["Report", "Status", "Date"],
      url: (patientId, category = "lab-results") =>
        `/DiagnosticReport?patient=${patientId}&departmentId=${departmentId}&category=${category}`,
      headersConfig: { "x-interaction-mode": "false" },
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
  label: "Orders",
  headers: ["Type", "Code", "Status", "Priority", "Date"],
  url: (id) => `/ServiceRequest?patient=${id}&category=108252007&encounter=Encounter/44602`,
  headersConfig: { "x-interaction-mode": "false" },
  mapRow: (res) => [
    res.category?.[0]?.coding?.[0]?.display || "N/A",  
    res.category?.[1]?.coding?.[0]?.code || "N/A",
    res.status || "N/A",                               
    res.priority || "N/A",                             
    res.authoredOn || "N/A",
  ].filter(Boolean),
},


documents: {
  label: "Documents",
},

    encounters: {
      label: "Encounters",
    },

    conditions: {
  label: "Conditions",
},


    tasks: {
  label: "Tasks",
  headers: ["Description", "Status", "Intent"],
  
  url: (id) =>
    `/Task?patient=${id}&departmentId=${departmentId}&practitioner=67`,
  headersConfig: { "x-interaction-mode": "false" },
  mapRow: (res) => [
    res.description || res.code?.coding?.[0]?.display, 
    res.status,
    res.intent,
  ].filter(Boolean),
},

    familyHistory: {
      label: "Family History",
    },

    
    questionnaireResponses: {
  label: "Questionnaire Responses",
},


    medications: {
      label: "Medications",
      headers: ["Medication", "Status"],
      url: (id) => `/MedicationStatement?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "false" },
      mapRow: (res) => [res.medicationCodeableConcept?.text, res.status].filter(Boolean),
    },

    procedures: {
      label: "Procedures",
      headers: ["Procedure", "Status", "Date"],
      url: (id) => `/Procedure?patient=${id}&departmentId=${departmentId}`,
      headersConfig: { "x-interaction-mode": "false" },
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
      headersConfig: { "x-interaction-mode": "false" },
      mapRow: (res) => [
        res.code?.text,
        res.created ? new Date(res.created).toLocaleDateString() : null,
      ].filter(Boolean),
      codeOptions: ["portal-status"],
    },
  }), [departmentId]);
};
