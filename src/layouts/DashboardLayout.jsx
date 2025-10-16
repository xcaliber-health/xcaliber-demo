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
  Book
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

  const handleGetCurlClick = () => setShowCurlDrawer(true);

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
        {
          to: "/claims-streaming",
          label: "Claims Data Streaming",
          icon: Cloud,
        },
        { to: "/providerDirectory", label: "Provider Directory", icon: Folder },
      ],
    },
    {
      title: "Sample App Workflows",
      links: [
        {
          to: "/scheduling/find",
          label: "Scheduling Mobile App",
          icon: Calendar,
        },
        {
          to: "/custom-clinical-processing",
          label: "Custom Clinical Processing",
          icon: HeartPulse,
        },
        {
          to: "/bulk-data-extraction",
          label: "Bulk Data Extraction",
          icon: DownloadCloud,
        },
        { to: "/claims", label: "Claims List", icon: FileText },
        { to: "/notes", label: "Notes", icon: Notebook },
        { to: "/orders", label: "Orders", icon: PackageCheck },
      ],
    },
    {
      title: "Health AI",
      links: [
        {
          to: "/document-reference",
          label: "Clinical Document Attachments",
          icon: ClipboardList,
        },
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
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      withCredentials: true,
    });

    console.log("Connecting to socket...");

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("Socket disconnected"));

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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-100">
        <img
          src="/XCaliber.png"
          alt="XCaliber Splash"
          className="h-28 w-auto animate-pulse drop-shadow-xl"
        />
        <p className="mt-6 text-gray-600 text-sm font-medium tracking-wide text-center px-6">
          This demo application uses{" "}
          <span className="font-semibold text-indigo-600">non-PHI</span> sample
          data only.
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
        messages,
      }}
    >
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-100 overflow-hidden">
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

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto hide-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = activePath === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-white/20"
                              : "bg-gray-100 group-hover:bg-indigo-100"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 group-hover:text-indigo-600"
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
              <span className="text-sm font-semibold text-indigo-600">
                This is a Non-PHI Sandbox with synthetic data
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={ehr}
                  onChange={(e) => setEhr(e.target.value)}
                  className="appearance-none bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
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
                  className="appearance-none bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {departments.map((deptId) => (
                    <option key={deptId} value={deptId}>
                      Department {deptId}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Header Right Buttons — Docs & GitHub */}
              <div className="flex items-center gap-3">
                {/* Docs Button */}
                <a
                  href="https://docs.xcaliberhealth.ai/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-md overflow-hidden transition-all duration-300 w-10 h-10 hover:w-auto hover:pr-4"
                >
                  <div className="flex items-center justify-center w-10 h-10 flex-none">
                    <Book className="w-5 h-5 text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="whitespace-nowrap text-gray-700 text-sm font-semibold opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-300">
                    XCaliber Docs
                  </span>
                </a>

                {/* GitHub Button */}
                <a
                  href="https://github.com/xcaliber-health/xcaliber-demo/tree/master"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-md overflow-hidden transition-all duration-300 w-10 h-10 hover:w-auto hover:pr-4"
                >
                  <div className="flex items-center justify-center w-10 h-10 flex-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.207 11.385c.6.11.793-.26.793-.577v-2.26c-3.338.728-4.042-1.61-4.042-1.61-.547-1.388-1.335-1.757-1.335-1.757-1.09-.747.083-.732.083-.732 1.205.086 1.84 1.24 1.84 1.24 1.07 1.834 2.807 1.304 3.492.998.108-.787.418-1.304.762-1.605-2.665-.304-5.466-1.366-5.466-6.078 0-1.343.465-2.443 1.233-3.304-.124-.304-.535-1.523.117-3.176 0 0 1.006-.322 3.3 1.23a11.43 11.43 0 016.006 0c2.29-1.552 3.293-1.23 3.293-1.23.655 1.653.244 2.872.12 3.176.77.861 1.23 1.961 1.23 3.304 0 4.723-2.806 5.77-5.478 6.068.43.37.815 1.096.815 2.21v3.28c0 .32.19.694.8.575A12 12 0 0024 12c0-6.627-5.373-12-12-12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="whitespace-nowrap text-gray-700 text-sm font-semibold opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-300">
                    GitHub
                  </span>
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>

          {/* Floating Buttons */}
          <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
            {/* Powered by XCaliber */}
            <div className="group relative flex items-center justify-end cursor-pointer select-none">
              <div className="flex items-center bg-white/70 backdrop-blur-md border border-gray-200 rounded-full shadow-md overflow-hidden transition-all duration-300 group-hover:pr-4 group-hover:w-auto w-10 h-10">
                <img
                  src="/favicon.png"
                  alt="XCaliber"
                  className="h-8 w-8 p-2 ml-1 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="whitespace-nowrap text-gray-700 text-sm font-semibold opacity-0 group-hover:opacity-100 ml-2 transition-opacity duration-300">
                  Powered by XCaliber Health
                </span>
              </div>
            </div>

            {/* Get Curl Floating Button */}
            <button
              onClick={handleGetCurlClick}
              className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 hover:shadow-indigo-500/30 transition-all duration-300 focus:outline-none"
              aria-label="Get Curl"
            >
              <Code2 className="w-5 h-5" />
            </button>
          </div>

          {/* Curl Drawer */}
          {showCurlDrawer && (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300"
              onClick={() => setShowCurlDrawer(false)}
            />
          )}

          <div
            className={`fixed top-0 right-0 h-full bg-white/95 backdrop-blur-md border-l border-gray-100 shadow-2xl w-[28rem] transform transition-transform duration-300 ease-in-out z-50 ${
              showCurlDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-600" /> cURL Request
                </h2>
                <button
                  onClick={() => setShowCurlDrawer(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold transition"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <textarea
                  className="w-full h-full rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 p-3 font-mono text-xs text-gray-700 resize-none shadow-inner"
                  readOnly
                  value={curlCommand}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
                >
                  <DownloadCloud className="w-4 h-4" />
                  Copy to Clipboard
                </button>
                {copySuccess && (
                  <p className="text-green-600 text-sm font-medium">
                    {copySuccess}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}
