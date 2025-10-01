
import { fhirFetch } from "./fhir";

export async function fetchClaims(patientId, sourceId) {
  const bundle = await fhirFetch(
    `/Claim?_count=1000&patient=${patientId}`,
    {
      sourceId,
      headers: {
        "x-interaction-mode": "false", // ✅ important for Athena passthrough
      },
       
    }
  );

  return (bundle.entry || []).map((e) => {
    const c = e.resource;

    // ✅ Athena → claim-notes in contained
    const notes =
      (c.contained || [])
        .filter(
          (r) =>
            r.resourceType === "Basic" &&
            r.code?.coding?.[0]?.code === "claim-note"
        )
        .map((r) => {
          const getExt = (url) =>
            r.extension?.find((e) => e.url === url)?.valueString;
          return {
            id: r.id,
            status: getExt(
              "http://xcaliber-fhir/structureDefinition/claim-note-status"
            ),
            ruleName: getExt(
              "http://xcaliber-fhir/structureDefinition/global-claim-rule-name"
            ),
            fixText: getExt(
              "http://xcaliber-fhir/structureDefinition/fix-text"
            ),
            pending:
              getExt(
                "http://xcaliber-fhir/structureDefinition/pending-flag"
              ) === "Y",
          };
        }) || [];

    // ✅ Transaction details (billed amount)
    let totalBilled = 0;
    const txn = c.extension?.find((ex) =>
      ex.url.includes("transaction-details")
    )?.valueString;

    if (txn) {
      try {
        const parsed = JSON.parse(txn);
        totalBilled = Object.values(parsed)
          .map((v) => parseFloat(v))
          .reduce((a, b) => a + b, 0);
      } catch {
        totalBilled = 0;
      }
    }

    return {
      id: c.id,
      serviceDate: c.billablePeriod?.end || c.billablePeriod?.start || null,
      status: notes[0]?.status || c.status || "Unknown",
      patient: c.patient?.display || c.patient?.reference || "N/A",
      provider: c.provider?.display || c.provider?.reference || "N/A",
      totalBilled,
      //totalPaid: 0, // ✅ no "paid" in Athena Claim response, default to 0
      notes,
    };
  });
}


export async function fetchClaimById(claimId, sourceId, patientId, departmentId) {
  const url = `/Claim/${claimId}?patient=${patientId}&departmentId=${departmentId}`;
  const c = await fhirFetch(url, { sourceId });

  // Notes (Athena only)
  const notes = (c.contained || [])
    .filter(r => r.resourceType === "Basic" && r.code?.coding?.[0]?.code === "claim-note")
    .map(r => {
      const getExt = (url) => r.extension?.find(e => e.url === url)?.valueString;
      return {
        id: r.id,
        status: getExt("http://xcaliber-fhir/structureDefinition/claim-note-status"),
        ruleName: getExt("http://xcaliber-fhir/structureDefinition/global-claim-rule-name"),
        fixText: getExt("http://xcaliber-fhir/structureDefinition/fix-text"),
        pending: getExt("http://xcaliber-fhir/structureDefinition/pending-flag") === "Y",
      };
    }) || [];

  // Diagnosis
  const diagnosis = (c.diagnosis || []).map(d => ({
    code: d.diagnosisCodeableConcept?.coding?.[0]?.code,
    display: d.diagnosisCodeableConcept?.coding?.[0]?.display,
    type: d.type?.[0]?.text,
  }));

  // Procedures
  const procedures = (c.procedure || []).map(p => ({
    code: p.procedureCodeableConcept?.coding?.[0]?.code,
    display: p.procedureCodeableConcept?.coding?.[0]?.display,
    amount: p.extension?.find(e => e.url === "http://xcaliber-fhir/structureDefinition/amount")?.valueString,
    txnId: p.extension?.find(e => e.url === "http://xcaliber-fhir/structureDefinition/procedure-transaction-id")?.valueString,
  }));

  // Insurance
  const insurance = (c.insurance || []).map(i => ({
    reference: i.coverage?.reference,
    packageId: i.coverage?.extension?.find(e => e.url === "http://xcaliber-fhir/structureDefinition/primary-insurance-package-id")?.valueString,
    status: i.coverage?.extension?.find(e => e.url === "http://xcaliber-fhir/structureDefinition/primary-insurance-status")?.valueString,
  }));

  // Extensions
  const extensions = (c.extension || []).map(e => ({
    url: e.url,
    value: e.valueString,
  }));

  return {
    id: c.id,
    created: c.created,
    billableEnd: c.billablePeriod?.end,
    status: notes[0]?.status || c.status || "Unknown",
    priority: c.priority?.coding?.[0]?.code || "N/A",
    patient: c.patient?.reference || "N/A",
    provider: c.provider?.reference || "N/A",
    totalBilled: c.total?.value ?? null,
    totalPaid: c.payment?.amount?.value ?? null,
    notes,
    diagnosis,
    procedures,
    insurance,
    extensions,
  };
}

