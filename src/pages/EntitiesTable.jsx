
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Reusable Collapsible Section
function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg mb-3">
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-left font-medium bg-gray-100 hover:bg-gray-200"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

// Renders any key:value object in table format
function KeyValueTable({ data }) {
  return (
    <table className="w-full text-sm border">
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr key={key} className="border-b">
            <td className="p-2 font-medium text-gray-700">{key}</td>
            <td className="p-2 text-gray-600">
              {typeof value === "object" ? JSON.stringify(value) : value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Main Entities Table
export default function EntitiesTable({ entities }) {
  if (!entities || Object.keys(entities).length === 0) {
    return <p className="text-gray-500">No entities found</p>;
  }

  return (
    <div>
      {Object.keys(entities).map((pageKey) => {
        const entity = entities[pageKey];
        return (
          <CollapsibleSection key={pageKey} title={`Page ${pageKey}`}>
            {/* Patient Info */}
            {entity.patient && (
              <CollapsibleSection title="Patient">
                <KeyValueTable data={entity.patient} />
              </CollapsibleSection>
            )}

            {/* Encounter Info */}
            {entity.encounter && (
              <CollapsibleSection title="Encounter">
                <KeyValueTable data={entity.encounter} />
              </CollapsibleSection>
            )}

            {/* Observations */}
            {entity.observations && entity.observations.length > 0 && (
              <CollapsibleSection title="Observations">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Test</th>
                      <th className="p-2 text-left">Result</th>
                      <th className="p-2 text-left">Units</th>
                      <th className="p-2 text-left">Reference</th>
                      <th className="p-2 text-left">Datetime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity.observations.map((obs, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{obs.entity_value}</td>
                        <td className="p-2">{obs.result_status}</td>
                        <td className="p-2">{obs.units}</td>
                        <td className="p-2">{obs.references_range}</td>
                        <td className="p-2">{obs.observation_datetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CollapsibleSection>
            )}

            {/* Labs */}
            {entity.labs && entity.labs.length > 0 && (
              <CollapsibleSection title="Labs">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Test</th>
                      <th className="p-2 text-left">Findings</th>
                      <th className="p-2 text-left">Observer</th>
                      <th className="p-2 text-left">Datetime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity.labs.map((lab, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{lab.entity_value}</td>
                        <td className="p-2">{lab.lab_test_findings}</td>
                        <td className="p-2">{lab.responsible_observer}</td>
                        <td className="p-2">{lab.analysis_datetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CollapsibleSection>
            )}
          </CollapsibleSection>
        );
      })}
    </div>
  );
}
