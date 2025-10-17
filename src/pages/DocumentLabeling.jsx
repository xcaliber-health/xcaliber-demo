import React from "react";

export default function DocumentLabeling() {
  // --- Data ---------------------------------------------------------------
  const clinic = {
    name: "YOUR CLINIC",
    phone: "(229) 883-1111",
    fax: "(229) 438-9999",
    address: "1234 Easy Street",
    clia: "11A012345",
    director: "Thomas K. Huard, PhD",
  };

  const patient = [
    { label: "Name", value: "SUE INFECTION" },
    { label: "Patient ID", value: "54321" },
    { label: "Birth Date", value: "03/20/2000" },
    { label: "Age", value: "23 years" },
    { label: "Doctor", value: "Ashley Gavelek, NP" },
    { label: "Specimen Type", value: "Urine" },
    { label: "Collection Date", value: "01/11/2024" },
    { label: "Lab Sample ID", value: "B240111111" },
  ];

  const tests = [
    ["Microalbumin", "39.0", "mg/dL", "ABNORMAL", "≤ 3.000"],
    ["Glucose", "17", "mg/dL", "NORMAL", "≤ 50.000"],
    ["Microprotein", "196.0", "mg/dL", "ABNORMAL", "≤ 15.000"],
    ["Beta-hydroxybutyrate (ketones)", "0.10", "mmol/L", "NORMAL", "≤ 0.500"],
    ["Bilirubin", "0.30", "mg/dL", "NORMAL", "≤ 1.000"],
    ["pH", "6.5", "—", "NORMAL", "4.800–8.500"],
    ["Specific Gravity", "1.013", "—", "NORMAL", "1.003–1.025"],
    ["Creatinine", "113.19", "mg/dL", "NORMAL", "20.000–300.000"],
    ["Hemoglobin", "17246", "µg/dL", "ABNORMAL", "≤ 30.000"],
    ["Nitrite", "163", "mg/L", "ABNORMAL", "≤ 100.000"],
  ];

  const ratios = [
    [
      "Albumin/Creatinine Ratio, Random Urine",
      "344.553",
      "mg/g",
      "SEVERELY INCREASED",
      "< 30.000",
    ],
    [
      "Protein/Creatinine Ratio, Random Urine",
      "1731.6",
      "mg/g",
      "SEVERELY INCREASED",
      "< 150.000",
    ],
  ];

  const reportMeta = [
    { label: "Report Type", value: "Final Report" },
    { label: "Originally Printed On", value: "01/12/2024" },
    {
      label: "Printed",
      value: "01/12/2024 10:03:37 AM (UTC-05:00) Eastern Time",
    },
    { label: "Accession #", value: "B240111111" },
    { label: "Patient #", value: "54321" },
  ];

  // Metadata from JSON
  const metadata = [
    {
      appointment_identifier: null,
      assigned_to: "Thomas K. Huard, PhD",
      created_date: "2024-01-12T10:03:37",
      date_of_admission: null,
      date_of_birth: "2000-03-20",
      date_of_discharge: null,
      date_of_issue: null,
      date_of_order: "2024-01-11",
      diagnosis_code: null,
      diagnostics_id: "B240111111",
      document_class: "Laboratory Report",
      document_status: "Final Report",
      is_phi: true,
      lab_test_names:
        "Microalbumin, Glucose, Microprotein, Beta-hydroxybutyrate(ketones), Bilirubin, pH, Specific Gravity, Creatinine, Hemoglobin, Nitrite, Albumin/Creatinine Ratio, Protein/Creatinine Ratio",
      last_modified_datetime: "2024-01-12T10:03:37",
      patient_full_name: "SUE INFECTION",
      patient_id: "54321",
      principal_diagnosis: null,
      procedure_code: "Urine Ratios Panel",
      procedure_id: null,
      provider_id: null,
      provider_user_name: "Ashley Gavelek, NP",
      servicing_facility: "YOUR CLINIC",
      sign_off: true,
      tie_to_order_id: null,
      confidence_score: "85.0%",
    },
  ];

  // --- UI helpers ---------------------------------------------------------
  const FlagBadge = ({ flag }) => {
    const base =
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ring-1";
    if (!flag) return null;

    if (flag === "NORMAL")
      return (
        <span
          className={`${base} text-emerald-700 bg-emerald-50 ring-emerald-200`}
        >
          <Dot className="fill-current" /> NORMAL
        </span>
      );

    if (flag?.includes("SEVERELY"))
      return (
        <span className={`${base} text-red-800 bg-red-50 ring-red-200`}>
          <Alert className="fill-current" /> {flag}
        </span>
      );

    return (
      <span className={`${base} text-rose-700 bg-rose-50 ring-rose-200`}>
        <Exclamation className="fill-current" /> {flag}
      </span>
    );
  };

  const StatCard = ({ title, value, unit, intent = "neutral" }) => {
    const palette = {
      neutral: {
        ring: "ring-gray-200",
        bg: "bg-white",
        text: "text-gray-900",
        chip: "bg-gray-100 text-gray-700",
      },
      warning: {
        ring: "ring-amber-200",
        bg: "bg-amber-50",
        text: "text-amber-900",
        chip: "bg-amber-100 text-amber-800",
      },
      danger: {
        ring: "ring-red-200",
        bg: "bg-red-50",
        text: "text-red-900",
        chip: "bg-red-100 text-red-800",
      },
    }[intent];

    return (
      <div
        className={`rounded-2xl ${palette.bg} ring-1 ${palette.ring} p-4 shadow-sm`}
      >
        <div className="text-xs font-medium text-gray-500">{title}</div>
        <div className={`mt-1 flex items-end gap-1.5 ${palette.text}`}>
          <div className="text-2xl font-semibold tabular-nums">{value}</div>
          {unit && (
            <div
              className={`text-[10px] ${palette.chip} px-1.5 py-0.5 rounded-full`}
            >
              {unit}
            </div>
          )}
        </div>
      </div>
    );
  };

  const Section = ({ title, children, subtitle }) => (
    <section className="mt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-blue-800 tracking-wide">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );

  // Metadata Component
  const MetadataSection = ({ metadata }) => {
    const metadataObj = metadata[0]; // Get first metadata object

    // Define which fields to show as available metadata
    const availableFields = [
      { key: "document_class", label: "Document Class" },
      { key: "document_status", label: "Document Status" },
      { key: "confidence_score", label: "Confidence Score" },
      { key: "assigned_to", label: "Assigned To" },
      { key: "provider_user_name", label: "Provider" },
      { key: "servicing_facility", label: "Facility" },
      { key: "created_date", label: "Created Date" },
      { key: "last_modified_datetime", label: "Last Modified" },
      { key: "is_phi", label: "Contains PHI" },
      { key: "sign_off", label: "Signed Off" },
    ];

    // Define fields that are not available (null values)
    const unavailableFields = [
      { key: "appointment_identifier", label: "Appointment ID" },
      { key: "date_of_admission", label: "Date of Admission" },
      { key: "date_of_discharge", label: "Date of Discharge" },
      { key: "diagnosis_code", label: "Diagnosis Code" },
      { key: "principal_diagnosis", label: "Principal Diagnosis" },
      { key: "procedure_id", label: "Procedure ID" },
      { key: "provider_id", label: "Provider ID" },
      { key: "tie_to_order_id", label: "Order ID" },
    ];

    const formatValue = (key, value) => {
      if (value === null || value === undefined) return null;

      // Format boolean values
      if (typeof value === "boolean") {
        return value ? "Yes" : "No";
      }

      // Format dates
      if (key.includes("date") || key.includes("datetime")) {
        try {
          return new Date(value).toLocaleDateString();
        } catch {
          return value;
        }
      }

      return value;
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className=" h-2 rounded-t-lg"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Metadata</h3>
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* Available Metadata */}
          <div className="space-y-3">
            {availableFields.map((field) => {
              const value = formatValue(field.key, metadataObj[field.key]);
              if (value === null) return null;

              return (
                <div key={field.key} className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium">
                    {field.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Unavailable Metadata */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium">
              No metadata available for these columns:
            </div>
            <div className="space-y-1">
              {unavailableFields.map((field, index) => (
                <div key={field.key} className="text-xs text-gray-400">
                  {index + 1}. {field.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Icons (tiny inline)
  const Dot = (props) => (
    <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden="true" {...props}>
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
  const Alert = (props) => (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 1.333 15.333 14H.667L8 1.333Zm0 9.334a.999.999 0 1 0 0 2 .999.999 0 0 0 0-2Zm-.833-4.667h1.666v3.333H7.167V6z" />
    </svg>
  );
  const Exclamation = (props) => (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 11h2v2H7v-2Zm0-8h2v6H7V3Z" />
    </svg>
  );

  // --- Component ----------------------------------------------------------
  return (
    <div className="font-sans antialiased bg-gradient-to-b from-slate-50 to-white h-screen print:bg-white">
      <div className="mx-auto max-w-7xl px-4 h-full py-6">
        <div className="flex gap-6 h-full">
          {/* Main Content */}
          <div className="flex-1 max-w-5xl overflow-y-auto h-full pr-2">
            {/* Header Banner */}
            <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-blue-200 bg-white">
              <div className="bg-blue-800/95 text-white px-6 py-6 md:px-8 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
                      {clinic.name}{" "}
                      <span className="opacity-80">Urinalysis Report</span>
                    </h1>
                    <p className="mt-1 text-xs md:text-sm opacity-90">
                      CLIA #{clinic.clia} • Laboratory Director:{" "}
                      {clinic.director}
                    </p>
                  </div>
                  <div className="text-xs md:text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    <div>
                      <span className="opacity-80">Address:</span>{" "}
                      {clinic.address}
                    </div>
                    <div>
                      <span className="opacity-80">Phone:</span> {clinic.phone}
                    </div>
                    <div>
                      <span className="opacity-80">Fax:</span> {clinic.fax}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {/* Patient Info + Key Stats */}
                <div>
                  <Section title="Patient Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {patient.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3 shadow-sm"
                        >
                          <div className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                            {item.label}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-900 break-words">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-semibold">Legend:</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>{" "}
                    Normal
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>{" "}
                    Abnormal
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>{" "}
                    Severely Increased
                  </span>
                </div>

                {/* Test Results */}
                <Section title="Test Results">
                  <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <colgroup>
                          <col className="w-[36%]" />
                          <col className="w-[16%]" />
                          <col className="w-[12%]" />
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                        </colgroup>
                        <thead>
                          <tr className="bg-slate-50/80">
                            {[
                              "Test Name",
                              "Result",
                              "Units",
                              "Flag",
                              "Reference Range",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left font-semibold text-slate-700 uppercase tracking-wide text-[11px] px-4 py-3 border-b border-slate-200"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tests.map((row, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                              }
                            >
                              <td className="px-4 py-3 border-b border-slate-100 text-slate-900">
                                {row[0]}
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 font-semibold tabular-nums">
                                {row[1]}
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 text-slate-700">
                                {row[2]}
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100">
                                <FlagBadge flag={row[3]} />
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 text-slate-700">
                                {row[4]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Section>

                {/* Ratios */}
                <Section title="Ratio Calculations">
                  <div className="rounded-2xl ring-1 ring-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <colgroup>
                          <col className="w-[40%]" />
                          <col className="w-[16%]" />
                          <col className="w-[12%]" />
                          <col className="w-[20%]" />
                          <col className="w-[12%]" />
                        </colgroup>
                        <thead>
                          <tr className="bg-slate-50/80">
                            {[
                              "Test Name",
                              "Result",
                              "Units",
                              "Flag",
                              "Reference Range",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left font-semibold text-slate-700 uppercase tracking-wide text-[11px] px-4 py-3 border-b border-slate-200"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ratios.map((row, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                              }
                            >
                              <td className="px-4 py-3 border-b border-slate-100 text-slate-900">
                                {row[0]}
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 font-semibold tabular-nums">
                                {row[1]}
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 text-slate-700">
                                {row[2]}
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100">
                                <FlagBadge flag={row[3]} />
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 text-slate-700">
                                {row[4]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Section>

                {/* Comments */}
                <Section title="Report Comments">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 shadow-sm">
                      <p className="text-sm">
                        <strong>Critical Notice:</strong> Testing performed by{" "}
                        <strong>YOUR UROLOGY CLINIC</strong>
                      </p>
                      <p className="text-sm mt-2">
                        This test was developed and validated by{" "}
                        <strong>Albany Urology Clinic</strong>.
                      </p>
                      <p className="text-sm mt-2">
                        It has not been cleared by the FDA but is authorized for
                        clinical use.
                      </p>
                      <p className="text-sm mt-2">
                        This laboratory is CLIA-certified for high-complexity
                        testing.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 shadow-sm">
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Flag Summary
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center justify-between">
                          <span>NORMAL</span>
                          <FlagBadge flag="NORMAL" />
                        </li>
                        <li className="flex items-center justify-between">
                          <span>ABNORMAL</span>
                          <FlagBadge flag="ABNORMAL" />
                        </li>
                        <li className="flex items-center justify-between">
                          <span>SEVERELY INCREASED</span>
                          <FlagBadge flag="SEVERELY INCREASED" />
                        </li>
                      </ul>
                    </div>
                  </div>
                </Section>

                {/* Footer Meta */}
                <Section title="Report Details">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {reportMeta.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl bg-white ring-1 ring-slate-200 p-3 shadow-sm"
                      >
                        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                          {m.label}
                        </div>
                        <div className="mt-1 text-sm text-slate-900">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500 italic">
                    Page 1 of 1
                  </p>
                </Section>
              </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-16"></div>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-6">
              <MetadataSection metadata={metadata} />
            </div>
          </div>
        </div>

        {/* Print Optimizations */}
        <style>{`
          @media print {
            body { background: white; }
            .shadow-xl, .shadow-sm { box-shadow: none !important; }
            .ring-1 { box-shadow: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
