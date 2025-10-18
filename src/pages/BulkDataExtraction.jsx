import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../layouts/DashboardLayout";
import {
  Users,
  Database,
  CheckCircle,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  DownloadCloud,
} from "lucide-react";
import {
  getResources,
  getIdsForResource,
  getMappingForId,
} from "../api/bulkData";
// :white_check_mark: Reusable Card component
function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}
// :white_check_mark: Reusable Dropdown component
function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="border-2 border-gray-200/50 py-3 px-4 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
// :white_check_mark: Copy-to-Clipboard Button Component
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
export default function BulkDataExtraction() {
  const ehrOptions = ["Athena", "Elation", "ECW", "Epic", "Cerner"];
  // :white_check_mark: Set default selected EHRs
  const navigate = useNavigate();
  const [sourceEHR, setSourceEHR] = useState("ECW");
  const [targetEHR, setTargetEHR] = useState("Athena");
  const [resources, setResources] = useState([]);
  const [expandedResource, setExpandedResource] = useState(null);
  const [resourceIds, setResourceIds] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [mappedId, setMappedId] = useState(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loadingIds, setLoadingIds] = useState(false);
  // :white_check_mark: Fetch resources when both EHRs selected
  useEffect(() => {
    if (sourceEHR && targetEHR) {
      setLoadingResources(true);
      getResources(sourceEHR)
        .then((res) => setResources(res))
        .finally(() => setLoadingResources(false));
    }
  }, [sourceEHR, targetEHR]);
  // :white_check_mark: Fetch IDs when resource expanded
  const handleExpandResource = async (resource) => {
    if (expandedResource === resource) {
      setExpandedResource(null); // collapse
      return;
    }
    setExpandedResource(resource);
    if (!resourceIds[resource]) {
      setLoadingIds(true);
      const ids = await getIdsForResource(sourceEHR, resource);
      setResourceIds((prev) => ({ ...prev, [resource]: ids }));
      setLoadingIds(false);
    }
  };

  // :white_check_mark: Fetch mapping for selected ID
  const handleSelectId = async (id) => {
    console.log("Selected ID:", id);
    setSelectedId(id);
    setMappedId(null);
    const mapped = await getMappingForId(id);
    setMappedId(mapped);
  };
  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 pb-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <DownloadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bulk Data Extraction
              </h1>
              <p className="text-sm text-gray-600">
                Extract and map resources between EHR systems
              </p>
            </div>
          </div>
          {/* Dropdowns */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Dropdown
              label="Source EHR"
              options={ehrOptions}
              value={sourceEHR}
              onChange={(e) => setSourceEHR(e.target.value)}
            />
            <Dropdown
              label="Target EHR"
              options={ehrOptions}
              value={targetEHR}
              onChange={(e) => setTargetEHR(e.target.value)}
            />
          </div>
          {/* Main Panel */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Resources + IDs */}
            <Card className="p-4 col-span-2">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-indigo-600">
                <Database className="w-4 h-4" /> Select what you want to migrate
              </h2>
              {loadingResources ? (
                <div className="flex justify-center items-center flex-1 min-h-[300px] text-indigo-600">
                  <RefreshCw className="animate-spin h-6 w-6 mr-2" />
                  Loading resources...
                </div>
              ) : (
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {resources.map((r) => (
                    <li key={r} className="border-b border-gray-100 pb-2">
                      <div
                        className={`flex justify-between items-center p-2 rounded-xl cursor-pointer ${
                          expandedResource === r
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleExpandResource(r)}
                      >
                        <span>{r}</span>
                        {expandedResource === r ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                      {expandedResource === r && (
                        <ul className="mt-2 space-y-1 pl-4">
                          {loadingIds ? (
                            <li className="text-gray-500 text-sm">
                              Loading IDs...
                            </li>
                          ) : (
                            (resourceIds[r] || []).map(({ id, name }) => (
                              <li
                                key={id}
                                onClick={() => handleSelectId(id)} // still pass the ID internally
                                className={`p-2 rounded-xl cursor-pointer text-sm ${
                                  selectedId === id
                                    ? "bg-purple-100 text-purple-700 font-medium"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                {name} {/* show name instead of raw ID */}
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            {/* Target Mapping */}
            <Card className="p-4">
              <h2 className="font-semibold mb-3 text-indigo-600">
                Extraction Details
              </h2>
              {selectedId ? (
                mappedId ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">New Record ID</p>
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-500 w-5 h-5" />
                        <span className="text-green-700 font-medium text-lg">
                          {mappedId}
                        </span>
                      </div>
                      <CopyButton text={mappedId} />
                    </div>
                    {/* New button to navigate */}
                    <button
                      onClick={() => navigate(`/patients/${mappedId}`)}
                      className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-xl transition"
                    >
                      View in Target EHR
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <RefreshCw className="animate-spin w-4 h-4" />
                    Checking mapping...
                  </div>
                )
              ) : (
                <p className="text-gray-500 text-sm">
                  Select an ID to view mapping.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
