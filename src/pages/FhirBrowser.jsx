
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Editor from '@monaco-editor/react';
import { Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';
import { AppContext } from "../layouts/DashboardLayout";

export default function FhirBrowser() {
  const { ehr } = useContext(AppContext); // "Athena" | "Elation"
  const [endpoints, setEndpoints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [params, setParams] = useState({});
  const [response, setResponse] = useState(null);
  const [jsonString, setJsonString] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);

  const toPascalCase = (str) =>
  str
    ? str
        .replace(/[_\s-]+/g, " ") // normalize separators
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("")
    : "";

  const EHR_CONFIG = {
    Athena: {
      baseUrl: "https://blitz.xcaliberapis.com/fhir-gateway-2/fhir/R4",
      endpointsFile: "/athena-endpoints.json",
      headers: {
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4Y2FsaWJlci1oZWFsdGguc2VydmljZS1hY2NvdW50LmlkIjoiNTFmNjg5M2EtMmZkZi00NDE3LWEzODUtOGEzOTlmYWRjNWUzIiwieGNhbGliZXItaGVhbHRoLmFjY291bnQuaWQiOiI5MWI1YzdlMy02NmQxLTRiMGMtODRmZC0yYzZjYjVjZjgzZmMiLCJ4Y2FsaWJlci1oZWFsdGguaW5zdGFuY2UuaWQiOiI5MTcyNmQyOC1lY2QxLTM2ZGYtODEzMi02MjdhZTgwZmUzMzIiLCJ1c2VyIjp7InVzZXJJZCI6ImI1M2VmNzJmLWVmNDYtNGQ5Yi1iMjhiLTJkZTI2OTJiYThiYSIsInVzZXJOYW1lIjoiSm9obiBTbWl0aCJ9LCJ4Y2FsaWJlci1oZWFsdGguc2NvcGVzIjpbIjkxNzI2ZDI4LWVjZDEtMzZkZi04MTMyLTYyN2FlODBmZTMzMi4qIl0sImNsYWltcyI6WyJtb2RlbHM6KiIsImFjdGl2aXRpZXM6KiIsIkFjdGl2aXRpZXM6KiIsInRhZ3M6KiIsImF0dHJpYnV0ZXM6KiIsImVudGl0aWVzOioiLCJwcm92aWRlci5lbnRyaWVzOioiLCJwYXRpZW50LmVudHJpZXM6KiIsInByb3ZpZGVyLXRvdGFsLmVudHJpZXM6KiIsIkNhc2VzLmVudHJpZXM6KiIsIlByb2ZpbGUuZW50cmllczoqIiwiVXNlci5lbnRyaWVzOioiLCJSb2xlLmVudHJpZXM6KiIsInZpZXcuZW50cmllczoqIiwiQ29kZXIuZW50cmllcyIsIm9yY2hfZXZlbnRzLmVudHJpZXM6KiIsInVzZXJ2aWV3cy5lbnRyaWVzOioiLCJWaWV3LmVudHJpZXM6KiIsIndvcmtlci5lbnRyaWVzOioiLCJyb2xlLmVudHJpZXM6KiIsIndvcmtpdGVtLmVudHJpZXM6KiIsInBlcm1pc3Npb25fcG9saWN5LmVudHJpZXM6KiIsImNvbGxlY3Rpb24uZW50cmllczoqIiwiZmlsdGVyLmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3dfc3RhdGlzdGljcy5lbnRyaWVzOioiLCJvcmNoZXN0cmF0aW9uX2V2ZW50LmVudHJpZXM6KiIsIndvcmtmbG93LmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3cuZW50cmllczoqIiwiY29kZXNldHM6KiJdLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpc3N1ZXJVcmwiOiJodHRwOi8vYmxpdHoueGNhbGliZXJhcGlzLmNvbS9hcGkvdjEvYXV0aC90b2tlblYyIiwiZXhwaXJ5QXQiOiIyMDI2LTA1LTE3VDIzOjU5OjU5WiIsInhjYWxpYmVyLWhlYWx0aC50ZW5hbnQuaWQiOiI1MTJmZTE2Yi01N2NjLTM4ODctYjI4Zi04MjlmMjFhYTllZjIiLCJpYXQiOjE3NTA0MDY1NTQsImV4cCI6MTc3OTAwNDk1NH0.XSt7JtaIhBZkWRC7rxLwnejiJR3pPsrTosR_AUS21R06b26o2PYRpxa4FusRZx1lk85H8Jg1-49A6J3RSwbMyU1zyg-dfr3zbma1Y08qpwvip35iQEF-LIF5gEN5rz4dfzLeMss2hV15EApCVdJwY4c57aKiqoy6CvepMD6yu_up0tpDQDpI3l_mxrN5DqRX5LmLeKBQ3D-wKUuFJi2CQmPi7VJg7yn-rnTSCqJoenjPAjgk2Gn5qu9agu43OBHuWZqLFr1k0YKzMVvXek-sdVWqS6I4BgjcGLcCF4FzYrzm2BNPefPIBKxrvfA22l5e7NUmdu-Ncv47nv44es8ydA", // shortened for clarity
        "x-source-id": "ef123977-6ef1-3e8e-a30f-3879cea0b344",
        "x-interaction-mode": "true",
      },
      defaultParams: {
        patient: "4406",
        departmentId: "150",
      },
    },
    Elation: {
      baseUrl: "https://blitz.xcaliberapis.com/fhir-gateway-2/fhir/R4",
      endpointsFile: "/elation-endpoints.json",
      headers: {
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4Y2FsaWJlci1oZWFsdGguc2VydmljZS1hY2NvdW50LmlkIjoiNTFmNjg5M2EtMmZkZi00NDE3LWEzODUtOGEzOTlmYWRjNWUzIiwieGNhbGliZXItaGVhbHRoLmFjY291bnQuaWQiOiI5MWI1YzdlMy02NmQxLTRiMGMtODRmZC0yYzZjYjVjZjgzZmMiLCJ4Y2FsaWJlci1oZWFsdGguaW5zdGFuY2UuaWQiOiI5MTcyNmQyOC1lY2QxLTM2ZGYtODEzMi02MjdhZTgwZmUzMzIiLCJ1c2VyIjp7InVzZXJJZCI6ImI1M2VmNzJmLWVmNDYtNGQ5Yi1iMjhiLTJkZTI2OTJiYThiYSIsInVzZXJOYW1lIjoiSm9obiBTbWl0aCJ9LCJ4Y2FsaWJlci1oZWFsdGguc2NvcGVzIjpbIjkxNzI2ZDI4LWVjZDEtMzZkZi04MTMyLTYyN2FlODBmZTMzMi4qIl0sImNsYWltcyI6WyJtb2RlbHM6KiIsImFjdGl2aXRpZXM6KiIsIkFjdGl2aXRpZXM6KiIsInRhZ3M6KiIsImF0dHJpYnV0ZXM6KiIsImVudGl0aWVzOioiLCJwcm92aWRlci5lbnRyaWVzOioiLCJwYXRpZW50LmVudHJpZXM6KiIsInByb3ZpZGVyLXRvdGFsLmVudHJpZXM6KiIsIkNhc2VzLmVudHJpZXM6KiIsIlByb2ZpbGUuZW50cmllczoqIiwiVXNlci5lbnRyaWVzOioiLCJSb2xlLmVudHJpZXM6KiIsInZpZXcuZW50cmllczoqIiwiQ29kZXIuZW50cmllcyIsIm9yY2hfZXZlbnRzLmVudHJpZXM6KiIsInVzZXJ2aWV3cy5lbnRyaWVzOioiLCJWaWV3LmVudHJpZXM6KiIsIndvcmtlci5lbnRyaWVzOioiLCJyb2xlLmVudHJpZXM6KiIsIndvcmtpdGVtLmVudHJpZXM6KiIsInBlcm1pc3Npb25fcG9saWN5LmVudHJpZXM6KiIsImNvbGxlY3Rpb24uZW50cmllczoqIiwiZmlsdGVyLmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3dfc3RhdGlzdGljcy5lbnRyaWVzOioiLCJvcmNoZXN0cmF0aW9uX2V2ZW50LmVudHJpZXM6KiIsIndvcmtmbG93LmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3cuZW50cmllczoqIiwiY29kZXNldHM6KiJdLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpc3N1ZXJVcmwiOiJodHRwOi8vYmxpdHoueGNhbGliZXJhcGlzLmNvbS9hcGkvdjEvYXV0aC90b2tlblYyIiwiZXhwaXJ5QXQiOiIyMDI2LTA1LTE3VDIzOjU5OjU5WiIsInhjYWxpYmVyLWhlYWx0aC50ZW5hbnQuaWQiOiI1MTJmZTE2Yi01N2NjLTM4ODctYjI4Zi04MjlmMjFhYTllZjIiLCJpYXQiOjE3NTA0MDY1NTQsImV4cCI6MTc3OTAwNDk1NH0.XSt7JtaIhBZkWRC7rxLwnejiJR3pPsrTosR_AUS21R06b26o2PYRpxa4FusRZx1lk85H8Jg1-49A6J3RSwbMyU1zyg-dfr3zbma1Y08qpwvip35iQEF-LIF5gEN5rz4dfzLeMss2hV15EApCVdJwY4c57aKiqoy6CvepMD6yu_up0tpDQDpI3l_mxrN5DqRX5LmLeKBQ3D-wKUuFJi2CQmPi7VJg7yn-rnTSCqJoenjPAjgk2Gn5qu9agu43OBHuWZqLFr1k0YKzMVvXek-sdVWqS6I4BgjcGLcCF4FzYrzm2BNPefPIBKxrvfA22l5e7NUmdu-Ncv47nv44es8ydA", // shortened for clarity
        "x-source-id": "162fbf17-1eff-398e-8934-854a3091fd65",
      },
      defaultParams: {},
    },
  };

  const { baseUrl, endpointsFile, headers, defaultParams = {} } =
    EHR_CONFIG[ehr] || {};

  // Update JSON string when response changes
  useEffect(() => {
    if (response) {
      try {
        const formatted = JSON.stringify(response, null, 2);
        setJsonString(formatted);
        setIsValid(true);
        setError(null);
      } catch (err) {
        setError('Failed to serialize response data');
        setIsValid(false);
      }
    } else {
      setJsonString('');
    }
  }, [response]);

  useEffect(() => {
    if (!endpointsFile) return;
    fetch(endpointsFile)
      .then((res) => res.json())
      .then(setEndpoints)
      .catch((err) =>
        console.error(`:x: Error loading ${endpointsFile}`, err)
      );
  }, [endpointsFile]);

  const handleSelect = (endpoint) => {
    setSelected(endpoint);
    setParams({});
    setResponse(null);
  };

  const handleChange = (name, value) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!selected) return;
    const finalParams = { ...defaultParams, ...params };
    let url = `${baseUrl}${selected.path}`;
    
    // Replace path params
    selected.parameters
      .filter((p) => p.in === "path")
      .forEach((p) => {
        if (finalParams[p.name]) {
          url = url.replace(`{${p.name}}`, encodeURIComponent(finalParams[p.name]));
        }
      });
    
    // Append query params
    const queryParams = selected.parameters
      .filter((p) => p.in === "query" && finalParams[p.name])
      .map(
        (p) => `${encodeURIComponent(p.name)}=${encodeURIComponent(finalParams[p.name])}`
      )
      .join("&");
    
    if (queryParams) {
      url += (url.includes("?") ? "&" : "?") + queryParams;
    }
    
    try {
      const res = await axios.get(url, { headers });
      setResponse(res.data);
    } catch (err) {
      if (err.response) {
        setResponse({
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data,
        });
      } else {
        setResponse({ error: err.message });
      }
    }
  };

  const handleEditorChange = (value) => {
    if (value === undefined) return;
    
    setJsonString(value);
    
    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      setError(null);
      setResponse(parsed);
    } catch (err) {
      setIsValid(false);
      setError(err.message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fhir_response.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r overflow-y-auto bg-gray-50 p-4">
        <h2 className="font-bold mb-3">FHIR Resources</h2>
        <ul className="space-y-2">
          {endpoints.map((ep, idx) => (
            <li
              key={idx}
              className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${
                selected === ep ? "bg-gray-300 font-semibold" : ""
              }`}
              onClick={() => handleSelect(ep)}
            >
              {toPascalCase(ep.resource)}
            </li>
          ))}
        </ul>
      </aside>
      
      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selected ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{toPascalCase(selected.resource)}</h2>
            <p className="text-gray-600 mb-4">{selected.path}</p>
            {selected.parameters
              .filter(
                (p) =>
                  p.in !== "header" &&
                  !(ehr === "Athena" && (p.name === "patient" || p.name === "departmentId"))
              )
              .map((p, i) => (
                <div key={i} className="mb-2">
                  <label className="block text-sm font-medium">
                    {p.name} {p.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={p.description}
                    value={params[p.name] || ""}
                    onChange={(e) => handleChange(p.name, e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              ))}
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
            >
              Send Request
            </button>
            
            {response && (
              <div className="mt-6">
                <div 
                  className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${
                    isFullscreen ? 'fixed inset-4 z-50' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-700">JSON Response</h4>
                      {!isValid && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Invalid JSON
                        </span>
                      )}
                      {isValid && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Valid
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors"
                        title="Copy JSON"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      
                      <button
                        onClick={handleDownload}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors"
                        title="Download JSON"
                      >
                        <Download size={16} />
                      </button>
                      
                      <button
                        onClick={toggleFullscreen}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-700">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  {/* Editor */}
                  <div className={isFullscreen ? 'h-full' : 'h-96'}>
                    <Editor
                      height="100%"
                      defaultLanguage="json"
                      value={jsonString}
                      onChange={handleEditorChange}
                      options={{
                        readOnly: false,
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        folding: true,
                        bracketMatching: 'always',
                        autoIndent: 'full',
                        formatOnPaste: true,
                        formatOnType: true,
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorSmoothCaretAnimation: 'on',
                        renderLineHighlight: 'line',
                        selectionHighlight: false,
                        occurrencesHighlight: false,
                        overviewRulerBorder: false,
                        hideCursorInOverviewRuler: true,
                      }}
                      theme="vs"
                    />
                  </div>

                  {/* Footer with stats */}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>
                        Lines: {jsonString.split('\n').length} | 
                        Size: {new Blob([jsonString]).size} bytes
                      </span>
                      <span className="text-gray-500">
                        Use Ctrl+F to search, Ctrl+H to find & replace
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select a resource from the left panel.</p>
        )}
      </main>
    </div>
  );
}