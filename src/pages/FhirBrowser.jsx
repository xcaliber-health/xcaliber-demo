
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import {
  Copy, Check, Download, Maximize2, Minimize2, AlertTriangle, Calendar, Box, Activity,
  Users, Mail, AlertCircle, Shield, FileText, Bookmark, CheckCircle, MapPin, Video,
  Package, PackageCheck, List, Home, User, CreditCard, UserCheck, Stethoscope,
  FileCog, CheckSquare, Archive, CreditCard as Edit, CheckSquare as SquareCheck,
  Flag, Search, Loader2, Database, Zap
} from "lucide-react";
import { AppContext } from "../layouts/DashboardLayout";

function Card({ children, className = "", gradient = false }) {
  return (
    <div className={`
      ${gradient
        ? 'bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30'
        : 'bg-white/95'
      }
      backdrop-blur-sm shadow-xl rounded-2xl border border-white/20
      transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]
      ${className}
    `}>
      {children}
    </div>
  );
}

function Button({ children, className = "", variant = "primary", size = "md", loading = false, ...props }) {
  const baseClasses =
    "font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 flex items-center gap-2 relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg",
    secondary:
      "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 shadow-md",
    ghost:
      "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-600 hover:text-indigo-700",
    success:
      "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:
      "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200",
    success:
      "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200",
    error:
      "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200",
    warning:
      "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

const resourceIconMap = {
  Allergyintolerance: AlertTriangle,
  Appointment: Calendar,
  Basic: Box,
  Careplan: Activity,
  Careteam: Users,
  Claim: FileText,
  Communication: Mail,
  Condition: AlertCircle,
  Coverage: Shield,
  Diagnosticreport: FileText,
  Documentreference: Bookmark,
  Eligibilityresponse: CheckCircle,
  Encounter: Calendar,
  Episodeofcare: Activity,
  Explanationofbenefit: CheckCircle,
  Familymemberhistory: Users,
  Goal: Flag,
  Immunization: Package,
  Insurancepackage: CreditCard,
  Location: MapPin,
  Media: Video,
  Medicationrequest: Package,
  Medicationstatement: PackageCheck,
  Observation: List,
  Organization: Home,
  Patient: User,
  Paymentnotice: CreditCard,
  Person: UserCheck,
  Practitioner: Stethoscope,
  Practitionerrole: FileCog,
  Procedure: CheckSquare,
  Provenance: Archive,
  Questionnaire: Edit,
  Questionnaireresponse: CheckSquare,
  Servicerequest: Activity,
  Tasks: SquareCheck,
};

function FhirBrowser() {
  const { ehr } = useContext(AppContext);
  const [endpoints, setEndpoints] = useState([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [params, setParams] = useState({});
  const [response, setResponse] = useState(null);
  const [jsonString, setJsonString] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resourceList, setResourceList] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [resourceSearchTerm, setResourceSearchTerm] = useState("");

  const toPascalCase = (str) =>
    str
      ? str
          .replace(/[_\s-]+/g, " ")
          .split(" ")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() +
              word.slice(1).toLowerCase()
          )
          .join("")
      : "";

  const EHR_CONFIG = {
    Athena: {
      baseUrl: "https://blitz.xcaliberapis.com/fhir-gateway-2/fhir/R4",
      endpointsFile: "/athena-endpoints.json",
      headers: {
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4Y2FsaWJlci1oZWFsdGguc2VydmljZS1hY2NvdW50LmlkIjoiNTFmNjg5M2EtMmZkZi00NDE3LWEzODUtOGEzOTlmYWRjNWUzIiwieGNhbGliZXItaGVhbHRoLmFjY291bnQuaWQiOiI5MWI1YzdlMy02NmQxLTRiMGMtODRmZC0yYzZjYjVjZjgzZmMiLCJ4Y2FsaWJlci1oZWFsdGguaW5zdGFuY2UuaWQiOiI5MTcyNmQyOC1lY2QxLTM2ZGYtODEzMi02MjdhZTgwZmUzMzIiLCJ1c2VyIjp7InVzZXJJZCI6ImI1M2VmNzJmLWVmNDYtNGQ5Yi1iMjhiLTJkZTI2OTJiYThiYSIsInVzZXJOYW1lIjoiSm9obiBTbWl0aCJ9LCJ4Y2FsaWJlci1oZWFsdGguc2NvcGVzIjpbIjkxNzI2ZDI4LWVjZDEtMzZkZi04MTMyLTYyN2FlODBmZTMzMi4qIl0sImNsYWltcyI6WyJtb2RlbHM6KiIsImFjdGl2aXRpZXM6KiIsIkFjdGl2aXRpZXM6KiIsInRhZ3M6KiIsImF0dHJpYnV0ZXM6KiIsImVudGl0aWVzOioiLCJwcm92aWRlci5lbnRyaWVzOioiLCJwYXRpZW50LmVudHJpZXM6KiIsInByb3ZpZGVyLXRvdGFsLmVudHJpZXM6KiIsIkNhc2VzLmVudHJpZXM6KiIsIlByb2ZpbGUuZW50cmllczoqIiwiVXNlci5lbnRyaWVzOioiLCJSb2xlLmVudHJpZXM6KiIsInZpZXcuZW50cmllczoqIiwiQ29kZXIuZW50cmllcyIsIm9yY2hfZXZlbnRzLmVudHJpZXM6KiIsInVzZXJ2aWV3cy5lbnRyaWVzOioiLCJWaWV3LmVudHJpZXM6KiIsIndvcmtlci5lbnRyaWVzOioiLCJyb2xlLmVudHJpZXM6KiIsIndvcmtpdGVtLmVudHJpZXM6KiIsInBlcm1pc3Npb25fcG9saWN5LmVudHJpZXM6KiIsImNvbGxlY3Rpb24uZW50cmllczoqIiwiZmlsdGVyLmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3dfc3RhdGlzdGljcy5lbnRyaWVzOioiLCJvcmNoZXN0cmF0aW9uX2V2ZW50LmVudHJpZXM6KiIsIndvcmtmbG93LmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3cuZW50cmllczoqIiwiY29kZXNldHM6KiJdLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpc3N1ZXJVcmwiOiJodHRwOi8vYmxpdHoueGNhbGliZXJhcGlzLmNvbS9hcGkvdjEvYXV0aC90b2tlblYyIiwiZXhwaXJ5QXQiOiIyMDI2LTA1LTE3VDIzOjU5OjU5WiIsInhjYWxpYmVyLWhlYWx0aC50ZW5hbnQuaWQiOiI1MTJmZTE2Yi01N2NjLTM4ODctYjI4Zi04MjlmMjFhYTllZjIiLCJpYXQiOjE3NTA0MDY1NTQsImV4cCI6MTc3OTAwNDk1NH0.XSt7JtaIhBZkWRC7rxLwnejiJR3pPsrTosR_AUS21R06b26o2PYRpxa4FusRZx1lk85H8Jg1-49A6J3RSwbMyU1zyg-dfr3zbma1Y08qpwvip35iQEF-LIF5gEN5rz4dfzLeMss2hV15EApCVdJwY4c57aKiqoy6CvepMD6yu_up0tpDQDpI3l_mxrN5DqRX5LmLeKBQ3D-wKUuFJi2CQmPi7VJg7yn-rnTSCqJoenjPAjgk2Gn5qu9agu43OBHuWZqLFr1k0YKzMVvXek-sdVWqS6I4BgjcGLcCF4FzYrzm2BNPefPIBKxrvfA22l5e7NUmdu-Ncv47nv44es8ydA",
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
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4Y2FsaWJlci1oZWFsdGguc2VydmljZS1hY2NvdW50LmlkIjoiNTFmNjg5M2EtMmZkZi00NDE3LWEzODUtOGEzOTlmYWRjNWUzIiwieGNhbGliZXItaGVhbHRoLmFjY291bnQuaWQiOiI5MWI1YzdlMy02NmQxLTRiMGMtODRmZC0yYzZjYjVjZjgzZmMiLCJ4Y2FsaWJlci1oZWFsdGguaW5zdGFuY2UuaWQiOiI5MTcyNmQyOC1lY2QxLTM2ZGYtODEzMi02MjdhZTgwZmUzMzIiLCJ1c2VyIjp7InVzZXJJZCI6ImI1M2VmNzJmLWVmNDYtNGQ5Yi1iMjhiLTJkZTI2OTJiYThiYSIsInVzZXJOYW1lIjoiSm9obiBTbWl0aCJ9LCJ4Y2FsaWJlci1oZWFsdGguc2NvcGVzIjpbIjkxNzI2ZDI4LWVjZDEtMzZkZi04MTMyLTYyN2FlODBmZTMzMi4qIl0sImNsYWltcyI6WyJtb2RlbHM6KiIsImFjdGl2aXRpZXM6KiIsIkFjdGl2aXRpZXM6KiIsInRhZ3M6KiIsImF0dHJpYnV0ZXM6KiIsImVudGl0aWVzOioiLCJwcm92aWRlci5lbnRyaWVzOioiLCJwYXRpZW50LmVudHJpZXM6KiIsInByb3ZpZGVyLXRvdGFsLmVudHJpZXM6KiIsIkNhc2VzLmVudHJpZXM6KiIsIlByb2ZpbGUuZW50cmllczoqIiwiVXNlci5lbnRyaWVzOioiLCJSb2xlLmVudHJpZXM6KiIsInZpZXcuZW50cmllczoqIiwiQ29kZXIuZW50cmllcyIsIm9yY2hfZXZlbnRzLmVudHJpZXM6KiIsInVzZXJ2aWV3cy5lbnRyaWVzOioiLCJWaWV3LmVudHJpZXM6KiIsIndvcmtlci5lbnRyaWVzOioiLCJyb2xlLmVudHJpZXM6KiIsIndvcmtpdGVtLmVudHJpZXM6KiIsInBlcm1pc3Npb25fcG9saWN5LmVudHJpZXM6KiIsImNvbGxlY3Rpb24uZW50cmllczoqIiwiZmlsdGVyLmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3dfc3RhdGlzdGljcy5lbnRyaWVzOioiLCJvcmNoZXN0cmF0aW9uX2V2ZW50LmVudHJpZXM6KiIsIndvcmtmbG93LmVudHJpZXM6KiIsIm9yY2hlc3RyYXRpb25fd29ya2Zsb3cuZW50cmllczoqIiwiY29kZXNldHM6KiJdLCJncmFudFR5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJpc3N1ZXJVcmwiOiJodHRwOi8vYmxpdHoueGNhbGliZXJhcGlzLmNvbS9hcGkvdjEvYXV0aC90b2tlblYyIiwiZXhwaXJ5QXQiOiIyMDI2LTA1LTE3VDIzOjU5OjU5WiIsInhjYWxpYmVyLWhlYWx0aC50ZW5hbnQuaWQiOiI1MTJmZTE2Yi01N2NjLTM4ODctYjI4Zi04MjlmMjFhYTllZjIiLCJpYXQiOjE3NTA0MDY1NTQsImV4cCI6MTc3OTAwNDk1NH0.XSt7JtaIhBZkWRC7rxLwnejiJR3pPsrTosR_AUS21R06b26o2PYRpxa4FusRZx1lk85H8Jg1-49A6J3RSwbMyU1zyg-dfr3zbma1Y08qpwvip35iQEF-LIF5gEN5rz4dfzLeMss2hV15EApCVdJwY4c57aKiqoy6CvepMD6yu_up0tpDQDpI3l_mxrN5DqRX5LmLeKBQ3D-wKUuFJi2CQmPi7VJg7yn-rnTSCqJoenjPAjgk2Gn5qu9agu43OBHuWZqLFr1k0YKzMVvXek-sdVWqS6I4BgjcGLcCF4FzYrzm2BNPefPIBKxrvfA22l5e7NUmdu-Ncv47nv44es8ydA",
        "x-source-id": "162fbf17-1eff-398e-8934-854a3091fd65",
      },
      defaultParams: {},
    },
  };

  const { baseUrl, endpointsFile, headers, defaultParams = {} } =
    EHR_CONFIG[ehr] || {};

  useEffect(() => {
    if (!searchTerm) {
      setFilteredEndpoints(endpoints);
    } else {
      const filtered = endpoints.filter(ep =>
        toPascalCase(ep.resource).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEndpoints(filtered);
    }
  }, [endpoints, searchTerm]);

  useEffect(() => {
    if (response) {
      try {
        const formatted = JSON.stringify(response, null, 2);
        setJsonString(formatted);
        setIsValid(true);
        setError(null);
      } catch (err) {
        setError("Failed to serialize response data");
        setIsValid(false);
      }
    } else {
      setJsonString("");
    }
  }, [response]);

  useEffect(() => {
    if (!endpointsFile) return;
    setLoading(true);
    fetch(endpointsFile)
      .then((res) => res.json())
      .then(setEndpoints)
      .catch((err) => console.error(`Error loading ${endpointsFile}`, err))
      .finally(() => setLoading(false));
  }, [endpointsFile]);

  const handleSelect = (endpoint) => {
    setSelected(endpoint);
    setParams({});
    setResponse(null);
    setResourceList([]);
    setSelectedResourceId(null);
    setResourceSearchTerm("");

    const finalParams = { ...defaultParams };
    handleAutoFetch(endpoint, finalParams);
  };

  const handleChange = (name, value) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoFetch = async (endpoint, finalParams) => {
    setLoading(true);

    let url = `${baseUrl}${endpoint.path}`;

    endpoint.parameters
      .filter((p) => p.in === "path" && p.name !== "_id")
      .forEach((p) => {
        if (finalParams[p.name]) {
          url = url.replace(`{${p.name}}`, encodeURIComponent(finalParams[p.name]));
        }
      });

    const queryParams = endpoint.parameters
      .filter((p) => p.in === "query" && finalParams[p.name])
      .map((p) => `${encodeURIComponent(p.name)}=${encodeURIComponent(finalParams[p.name])}`)
      .join("&");

    if (queryParams) {
      url += (url.includes("?") ? "&" : "?") + queryParams;
    }

    try {
      const res = await axios.get(url, { headers });
      const resources = res.data.entry?.map((entry) => entry.resource) || [];
      setResourceList(resources);
      setResponse(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResourceId = async (id) => {
    setSelectedResourceId(id);
    if (!selected) return;

    setLoading(true);
    const url = `${baseUrl}${selected.path}/${id}`;
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
    } finally {
      setLoading(false);
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
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fhir_response.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const filteredResourceList = resourceList.filter(res =>
    res.id?.toLowerCase().includes(resourceSearchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex overflow-hidden">
      <aside className="w-80 flex flex-col border-r border-white/20 backdrop-blur-sm bg-white/80">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FHIR Resources
              </h2>
              <p className="text-sm text-gray-600">{ehr} EHR System</p>
            </div>
          </div>
          <div className="relative">
            {/*<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-800 opacity-90 w-4 h-4"/>*/}
            <Search 
  className="absolute left-3 top-1/2 transform -translate-y-1/2 !text-indigo-700 w-5 h-5"
  strokeWidth={4.5}
/>

            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading && !selected ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="ml-2 text-gray-600">Loading resources...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEndpoints.map((ep, idx) => {
                const iconName = toPascalCase(ep.resource);
                const ResourceIcon = resourceIconMap[iconName] || Box;
                const isSelected = selected === ep;
                return (
                  <div
                    key={idx}
                    className={`
                      cursor-pointer p-3 rounded-xl transition-all duration-200 group
                      ${isSelected
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md"
                      }
                    `}
                    onClick={() => handleSelect(ep)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                        ${isSelected
                          ? "bg-white/20"
                          : "bg-gradient-to-r from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200"
                        }
                      `}>
                        <ResourceIcon className={`w-4 h-4 ${isSelected ? "text-white" : "text-indigo-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${isSelected ? "text-white" : "text-gray-800"}`}>
                          {iconName}
                        </div>
                        <div className={`text-xs truncate ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                          {ep.path}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="p-6 border-b border-white/20 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  {(() => {
                    const iconName = toPascalCase(selected.resource);
                    const ResourceIcon = resourceIconMap[iconName] || Box;
                    return <ResourceIcon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {toPascalCase(selected.resource)}
                  </h1>
                  <p className="text-gray-600 font-mono text-sm">{selected.path}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              <div className="h-full flex gap-6">
                {/* Resource ID card only if response not present */}
                {resourceList.length > 0 && !response && (
                  <Card className="flex-1 rounded-xl flex flex-col max-h-[520px]">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                        <List className="w-4 h-4" />
                        Resource IDs ({filteredResourceList.length})
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search IDs..."
                          value={resourceSearchTerm}
                          onChange={(e) => setResourceSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-gray-200/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {loading && !response ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
  <thead className="bg-indigo-100">
    <tr>
      <th className="px-16 py-2 text-left text-sm font-semibold text-indigo-600">ID</th>
      <th className="px-16 py-2 text-left text-sm font-semibold text-indigo-600">Last Updated</th>
      
    </tr>
  </thead>
  <tbody>
    {filteredResourceList.map((res) => (
      <tr
        key={res.id}
        className={`cursor-pointer transition-colors duration-200 ${
          selectedResourceId === res.id
            ? "bg-indigo-50"
            : "hover:bg-gray-50"
        }`}
        onClick={() => handleSelectResourceId(res.id)}
      >
        <td className="px-16 py-2 font-mono text-sm text-gray-800">{res.id}</td>
        <td className="px-16 py-2 text-sm text-gray-600">
          {res.meta?.lastUpdated
            ? new Date(res.meta.lastUpdated).toLocaleString()
            : "—"}
        </td>
        
      </tr>
    ))}
  </tbody>
</table>

                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Response card only if response present */}
                {response && (
                  <Card className={`flex-1 flex flex-col max-h-[520px] ${isFullscreen ? "fixed inset-4 z-50" : ""}`} gradient>
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-gray-800">JSON Response</h4>
                        {!isValid ? (
                          <Badge variant="error">Invalid JSON</Badge>
                        ) : (
                          <Badge variant="success">Valid JSON</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownload}>
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                          {isFullscreen ? "Exit" : "Fullscreen"}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200 text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <strong>Error:</strong> {error}
                      </div>
                    )}
                    <div className={`flex-1 ${isFullscreen ? "h-full" : ""}`}>
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={jsonString}
                        onChange={handleEditorChange}
                        options={{
                          readOnly: false,
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: "on",
                          wordWrap: "on",
                          folding: true,
                          bracketMatching: "always",
                          autoIndent: "full",
                          formatOnPaste: true,
                          formatOnType: true,
                          scrollBeyondLastLine: false,
                          smoothScrolling: true,
                          cursorSmoothCaretAnimation: "on",
                          renderLineHighlight: "line",
                          selectionHighlight: false,
                          occurrencesHighlight: false,
                          overviewRulerBorder: false,
                          hideCursorInOverviewRuler: true,
                          stickyScroll: { enabled: false },
                        }}
                        theme="vs"
                      />
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>
                          Lines: {jsonString.split("\n").length} | Size: {new Blob([jsonString]).size} bytes
                        </span>
                        <span className="text-gray-500">Ctrl+F to search, Ctrl+H to find & replace</span>
                      </div>
                    </div>
                  </Card>
                )}

                {!response && resourceList.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <Card className="p-12 text-center max-w-md" gradient>
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Database className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Resources</h3>
                      <p className="text-gray-600">Fetching data from the FHIR server...</p>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-12 text-center max-w-md" gradient>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select a FHIR Resource</h3>
              <p className="text-gray-600 mb-6">Choose a resource from the sidebar to start exploring FHIR data</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>{endpoints.length} resources available</span>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default FhirBrowser;
