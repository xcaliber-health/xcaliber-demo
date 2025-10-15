

import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { io } from "socket.io-client";
import {
  Calendar,
  Users,
  FileText,
  Folder,
  Database,
  ChevronDown,
  ClipboardList,
  HeartPulse,
  Notebook,
  PackageCheck,
  Code2,
  List,
  Cpu,
  DownloadCloud,
  Cloud,
} from "lucide-react";

export const AppContext = createContext();

export default function DashboardLayout() {
  const [ehr, setEhr] = useState("Athena");
  const [departmentId, setDepartmentId] = useState("1");
  const [showSplash, setShowSplash] = useState(true);
  const [showCurlDrawer, setShowCurlDrawer] = useState(false);
  const [curlCommand, setCurlCommand] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [messages, setMessages] = useState([]);


  const handleGetCurlClick = () => {
    setShowCurlDrawer(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(curlCommand)
      .then(() => setCopySuccess("Copied!"))
      .catch(() => setCopySuccess("Failed to copy"));
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const sourceIdMap = {
    Athena: import.meta.env.VITE_SOURCE_ID_ATHENA,
    Elation: import.meta.env.VITE_SOURCE_ID_ELATION,
  };
  const sourceId = sourceIdMap[ehr] || null;

  const location = useLocation();
  const activePath = location.pathname;

  const departments = [
    1, 21, 62, 82, 102, 142, 143, 144, 145, 147, 148, 149, 150, 155, 157, 158,
    159, 160, 162, 163, 164, 165, 166, 168, 169, 170, 180, 181, 183, 184, 185,
    192, 194, 195,
  ];

    const navGroups = [
    {
      title: "Integration & Interoperability",
      links: [
        { to: "/patients", label: "Oncologist Patient Chart", icon: Users },
        { to: "/scripts", label: "EHR Operator", icon: Cpu },
        { to: "/claims-streaming", label: "Claims Data Streaming", icon: Cloud },
        { to: "/providerDirectory", label: "Provider Directory", icon: Folder },
      ],
    },
    {
      title: "Sample App Workflows",
      links: [
        { to: "/scheduling/find", label: "Scheduling Mobile App", icon: Calendar },
        {
          to: "/custom-clinical-processing",
          label: "Custom Clinical Processing",
          icon: HeartPulse,
        },
        { to: "/bulk-data-extraction", label: "Bulk Data Extraction", icon: DownloadCloud },
        
        { to: "/claims", label: "Claims List", icon: FileText },
        
        { to: "/notes", label: "Notes", icon: Notebook },
        { to: "/orders", label: "Orders", icon: PackageCheck },
      ],
    },
    {
    title: "Health AI",
    links: [
      { to: "/document-reference", label: "Clinical Document Attachments", icon: ClipboardList },
    ],
  },
    {
      title: "Developer Tools",
      links: [
        { to: "/fhir-browser", label: "FHIR Browser", icon: Database },
        { to: "/event-browser", label: "Event Browser", icon: List },
      ],
    },
  ];


  useEffect(() => {
    //const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      withCredentials: true,
    });

    console.log("Connecting to socket...");

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    // Listen for incoming messages (e.g., SMS notifications)
    socket.on("new-sms", (msg) => {
      console.log("Received SMS:", msg);
      setMessages((prev) => [
        ...prev,
        { text: msg.body || JSON.stringify(msg), sender: "clinic" },
      ]);
    });

    return () => socket.disconnect();
  }, []);


  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <img
          src="/XCaliber.png"
          alt="XCaliber Splash"
          className="h-28 w-auto animate-pulse drop-shadow-xl"
        />
        <p className="mt-6 text-gray-600 text-sm font-medium tracking-wide text-center px-6">
          This demo application uses{" "}
          <span className="font-semibold text-blue-600">non-PHI</span> sample data
          only.
        </p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        ehr,
        departmentId,
        sourceId,
        setLatestCurl: setCurlCommand,
        messages, // This is important
      }}
    >
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white/95 backdrop-blur-sm shadow-2xl flex flex-col fixed left-0 top-0 bottom-0 border-r border-white/20">
          <div className="px-4 py-3 border-b border-gray-100/50">
            <div className="flex items-center justify-center space-x-3 ml-2">
              <img
                src="/logo.png"
                alt="Acme Health Logo"
                className="h-14 w-auto drop-shadow-sm"
              />
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    //const isActive = activePath.startsWith(link.to);
                    const isActive = activePath === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-white/20"
                              : "bg-gray-100 group-hover:bg-blue-100"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 group-hover:text-blue-600"
                            }`}
                          />
                        </div>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-72 flex flex-col overflow-hidden">
          <header className="h-16 bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 flex items-center justify-between px-6 space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-blue-600">
                This is a Non-PHI Sandbox with synthetic data
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={ehr}
                  onChange={(e) => setEhr(e.target.value)}
                  className="appearance-none bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <option value="Athena">Athena</option>
                  <option value="Elation">Elation</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="appearance-none bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {departments.map((deptId) => (
                    <option key={deptId} value={deptId}>
                      Department {deptId}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>

          {/* Floating Get Curl Button */}
          <button
            onClick={handleGetCurlClick}
            className="fixed bottom-8 right-8 bg-blue-600 text-white py-3 px-5 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Get Curl"
          >
            <Code2 className="w-6 h-6" />
          </button>

          {/* Curl Drawer */}
          {showCurlDrawer && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={() => setShowCurlDrawer(false)}
            />
          )}
          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-2xl w-96 transform transition-transform duration-300 ease-in-out z-50 ${
              showCurlDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">cURL Request</h2>
                <button
                  onClick={() => setShowCurlDrawer(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <textarea
                className="flex-1 w-full rounded border p-2 font-mono text-sm mb-4 resize-none"
                readOnly
                value={curlCommand} // <- now uses the actual generated curl
              />
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Copy to Clipboard
              </button>
              {copySuccess && (
                <p className="text-green-600 mt-2">{copySuccess}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
{/* Powered by XCaliber */}
<div className="fixed bottom-8 right-24 flex items-center gap-3 text-gray-600 text-lg opacity-90 pointer-events-none z-50">
  <span className="font-bold text-lg">Powered by</span>
  <img src="/XCaliber.png" alt="XCaliber Logo" className="h-10 w-auto" />
</div>





    </AppContext.Provider>
  );
}
