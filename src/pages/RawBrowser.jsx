import React, { useState, useEffect, useContext } from "react";
import Editor from "@monaco-editor/react";
import {
  Loader2,
  FileText,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  AlertCircle,
  Database,
} from "lucide-react";
import { AppContext } from "../layouts/DashboardLayout";

// Tailwind Card
function Card({ children, className = "", gradient = false }) {
  return (
    <div
      className={`
      ${gradient ? "bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30" : "bg-white"}
      shadow-xl rounded-2xl border border-white/20
      transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]
      flex flex-col
      ${className}
    `}
    >
      {children}
    </div>
  );
}

// Reusable Button
function Button({ children, className = "", variant = "primary", size = "sm", ...props }) {
  const baseClasses =
    "font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 flex items-center gap-2 relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg",
    ghost: "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-gray-600 hover:text-indigo-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 rounded-xl",
  };

  return (
    <button {...props} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

function RawBrowser() {
  const { ehr } = useContext(AppContext);
  const [resources, setResources] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jsonString, setJsonString] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!ehr) return;
    setLoading(true);

    const loadResources = async () => {
      try {
        console.log("...............",ehr )
        const filename = `/output/${ehr.toLowerCase()}-mdp.json`;
        const res = await fetch(filename);
        if (!res.ok) throw new Error("File not found");
        const json = await res.json();
        const names = Object.keys(json);
        setResources(names.map((name) => ({ name, content: json[name] })));
        setSelectedContent(null);
        setJsonString("");
      } catch (err) {
        console.error(err);
        setResources([]);
        setSelectedContent({ error: "Failed to load EHR data" });
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [ehr]);

  const handleSelectResource = (resource) => {
    setSelectedContent(resource.content);
    setJsonString(JSON.stringify(resource.content, null, 2));
    setIsValid(true);
    setError(null);
  };

  const handleEditorChange = (value) => {
    setJsonString(value || "");
    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      setError(null);
      setSelectedContent(parsed);
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
    } catch {}
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar */}
      <div className="w-80 p-4 border-r border-gray-200/30 bg-white/50 backdrop-blur-sm overflow-auto">
        <h1 className="text-xl font-bold mb-4 text-indigo-600">Resources</h1>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-indigo-500 mr-2" />
            Loading {ehr}...
          </div>
        ) : resources.length > 0 ? (
          <ul className="space-y-1">
            {resources.map((res) => (
              <li
                key={res.name}
                onClick={() => handleSelectResource(res)}
                className="flex items-center gap-2 cursor-pointer hover:text-indigo-600"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                {res.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No resources found</p>
        )}
      </div>

      {/* JSON Viewer */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        {selectedContent ? (
            <Card
            className={`flex-1 overflow-hidden bg-white ${
                isFullscreen ? "fixed inset-4 z-50 p-6" : "flex flex-col"
            }`}
            gradient={false}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-800">JSON Viewer</h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {isValid ? "Valid JSON" : "Invalid JSON"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{" "}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}{" "}
                  {isFullscreen ? "Exit" : "Fullscreen"}
                </Button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2 bg-red-50 text-red-700 text-sm flex items-center gap-2 border-b border-red-200">
                <AlertCircle className="w-4 h-4" />
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Editor */}
            <div className="flex-1 min-h-[400px]">
              <Editor
                height="100%"
                defaultLanguage="json"
                value={jsonString}
                onChange={handleEditorChange}
                theme="light"
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
                }}
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 text-xs text-gray-600 flex justify-between">
              <span>
                Lines: {jsonString.split("\n").length} | Size: {new Blob([jsonString]).size} bytes
              </span>
              <span className="text-gray-500">Ctrl+F to search, Ctrl+H to find & replace</span>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center max-w-md mx-auto mt-20" gradient>
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Resource</h3>
            <p className="text-gray-600">Choose a resource from the left panel to start exploring JSON data</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default RawBrowser;
