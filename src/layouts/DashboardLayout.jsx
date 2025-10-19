import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, createContext, useRef } from "react";
import { io } from "socket.io-client";
import {
  Calendar,
  Users,
  FileText,
  Folder,
  Database,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Notebook,
  PackageCheck,
  Code2,
  List,
  Cpu,
  DownloadCloud,
  Cloud,
  Book,
  BarChart2,
  Terminal,
  ChevronLeft,
  FileSignature,
  Airplay,
} from "lucide-react";

export const AppContext = createContext();

const EHR_OPTIONS = {
  Athena: ["MDP API", "FHIR", "EHR Operator"],
  Elation: ["REST API", "FHIR", "EHR Operator", "Webhooks"],
  ECW: ["FHIR", "EHR Operator", "HL7"],
  Epic: ["FHIR", "EHR Operator", "HL7"],
  HIE: ["CCDA", "HL7"],
  Cerner: ["FHIR", "HL7"],
  Meditech: ["FHIR", "HL7"],
  PracticeFusion: ["FHIR"],
  Veradigm: ["FHIR"],
  PointClickCare: ["Rest", "FHIR", "EHR Operator"],
};

// Mock EHR list
const MOCK_EHRS = [
  "Epic",
  "HIE",
  "Cerner",
  "Meditech",
  "PracticeFusion",
  "Veradigm",
  "PointClickCare",
];

function EHRDropdown({ ehr, setEhr, setParentEhr, setChildEhr }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredParent, setHoveredParent] = useState(null);
  const dropdownRef = useRef(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setHoveredParent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleParentMouseEnter = (key) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredParent(key);
  };

  const handleParentMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredParent(null);
    }, 300); // 300ms delay before hiding
  };

  // const handleParentClick = (key) => {
  //   setEhr(key);
  //   setParentEhr(key);
  //   setChildEhr(null);
  //   setIsOpen(false);
  // };
  const handleParentClick = (key) => {
    const children = EHR_OPTIONS[key];
    const firstChild = children.length > 0 ? children[0] : null;

    if (firstChild) {
      setEhr(`${key}: ${firstChild}`);
      setParentEhr(key);
      setChildEhr(firstChild);
    } else {
      setEhr(key);
      setParentEhr(key);
      setChildEhr(null);
    }

    setIsOpen(false);
  };

  const handleChildClick = (parent, child) => {
    setEhr(`${parent}: ${child}`);
    setParentEhr(parent);
    setChildEhr(child);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
      >
        {ehr}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] py-1">
          {Object.entries(EHR_OPTIONS).map(([key, children]) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => handleParentMouseEnter(key)}
              onMouseLeave={handleParentMouseLeave}
            >
              <button
                onClick={() => handleParentClick(key)}
                className={`w-full text-left px-4 py-2.5 flex justify-between items-center text-sm font-medium hover:bg-indigo-50 transition-colors ${
                  ehr.startsWith(key)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700"
                }`}
              >
                <span>{key}</span>
                {children.length > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {children.length > 0 && (
                <div
                  className={`absolute left-full top-0 ml-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-[10000] py-1 transition-opacity duration-150 ${
                    hoveredParent === key
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  {children.map((child) => (
                    <button
                      key={child}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      onClick={() => handleChildClick(key, child)}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const [ehr, setEhr] = useState("Athena");
  const [parentEhr, setParentEhr] = useState("Athena");
  const [childEhr, setChildEhr] = useState(null);
  const [departmentId, setDepartmentId] = useState("150");
  const [showSplash, setShowSplash] = useState(true);
  const [showCurlDrawer, setShowCurlDrawer] = useState(false);
  const [curlCommand, setCurlCommand] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [messages, setMessages] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // sidebar collapsed state

  const handleGetCurlClick = () => setShowCurlDrawer(true);
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(curlCommand)
      .then(() => setCopySuccess("Copied!"))
      .catch(() => setCopySuccess("Failed to copy"));
  };

  useEffect(() => {
    const firstParent = "Athena"; // or any default
    const firstChild = EHR_OPTIONS[firstParent][0]; // first child

    setParentEhr(firstParent);
    setChildEhr(firstChild);
    setEhr(`${firstParent}: ${firstChild}`);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const baseUrlMap = {
    Athena: import.meta.env.VITE_API_BASE,
    Elation: import.meta.env.VITE_API_BASE,
    ECW: import.meta.env.VITE_API_BASE_ECW,
    Epic: import.meta.env.VITE_SOURCE_ID_EPIC_MOCK,
    HIE: import.meta.env.VITE_SOURCE_ID_KNO2_MOCK,
    Cerner: import.meta.env.VITE_SOURCE_ID_CERNER_MOCK,
    Meditech: import.meta.env.VITE_SOURCE_ID_MEDITECH_MOCK,
    PracticeFusion: import.meta.env.VITE_SOURCE_ID_PRACTICEFUSION_MOCK,
    Veradigm: import.meta.env.VITE_SOURCE_ID_VERADIGM_MOCK,
    PointClickCare: import.meta.env.VITE_SOURCE_ID_POINTCLICKCARE_MOCK,
  };

  const sourceIdMap = {
    Athena: import.meta.env.VITE_SOURCE_ID_ATHENA,
    Elation: import.meta.env.VITE_SOURCE_ID_ELATION,
    ECW: import.meta.env.VITE_SOURCE_ID_ECW,
    Epic: import.meta.env.VITE_SOURCE_ID_EPIC_MOCK,
    HIE: import.meta.env.VITE_SOURCE_ID_KNO2_MOCK,
    Cerner: import.meta.env.VITE_SOURCE_ID_CERNER_MOCK,
    Meditech: import.meta.env.VITE_SOURCE_ID_MEDITECH_MOCK,
    PracticeFusion: import.meta.env.VITE_SOURCE_ID_PRACTICEFUSION_MOCK,
    Veradigm: import.meta.env.VITE_SOURCE_ID_VERADIGM_MOCK,
    PointClickCare: import.meta.env.VITE_SOURCE_ID_POINTCLICKCARE_MOCK,
  };

  const sourceId =
    sourceIdMap[parentEhr] || import.meta.env.VITE_SOURCE_ID_ATHENA;
  const baseUrl = baseUrlMap[parentEhr] || import.meta.env.VITE_API_BASE;
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
          label: "Real-Time Claims Feed to Snowflake",
          icon: Cloud,
        },
        { to: "/providerDirectory", label: "Provider Directory", icon: Folder },
        {
          to: "/knowledgesource",
          label: "Content Repository",
          icon: Airplay,
        },
      ],
    },
    {
      title: "Sample App Workflows",
      links: [
        {
          to: "/scheduling/find",
          label: "Scheduling Workflow Automation",
          icon: Calendar,
        },
        {
          to: "/custom-clinical-processing",
          label: "Real-Time Clinical Intervention",
          icon: HeartPulse,
        },
        {
          to: "/bulk-data-extraction",
          label: "Bulk Data Extraction",
          icon: DownloadCloud,
        },
        { to: "/claims", label: "Claims", icon: FileText },
      ],
    },
    {
      title: "Health AI",
      links: [
        {
          to: "/document-reference",
          label: "Clinical Document Processing",
          icon: ClipboardList,
        },
        { to: "/chart-summary", label: "Chart Summary", icon: BarChart2 },
        {
          to: "/document-labeling",
          label: "AI-Ready Labeled Dataset",
          icon: FileSignature,
        },
      ],
    },
    {
      title: "Developer Tools",
      links: [
        { to: "/fhir-browser", label: "FHIR Browser", icon: Database },
        { to: "/event-browser", label: "Event Browser", icon: List },
        //{ to: "/raw-browser", label: "Raw Browser", icon: Terminal },
      ],
    },
  ];

  // useEffect(() => {
  //   const socket = io(import.meta.env.VITE_SOCKET_URL, {
  //     transports: ["websocket", "polling"],
  //     reconnection: true,
  //     withCredentials: true,
  //   });

  //   socket.on("connect", () => console.log("Socket connected:", socket.id));
  //   socket.on("disconnect", () => console.log("Socket disconnected"));
  //   socket.on("new-sms", (msg) => {
  //     setMessages((prev) => [
  //       ...prev,
  //       { text: msg.body || JSON.stringify(msg), sender: "clinic" },
  //     ]);
  //   });

  //   return () => socket.disconnect();
  // }, []);

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
        parentEhr,
        childEhr,
        departmentId,
        sourceId,
        baseUrl,
        setLatestCurl: setCurlCommand,
        messages,
        MOCK_EHRS,
        localEvents,
        setLocalEvents,
      }}
    >
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-100 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex flex-col fixed left-0 top-0 bottom-0 bg-white shadow-xl border-r border-gray-200 z-50 transition-all duration-300 ${
            collapsed ? "w-20" : "w-72"
          }`}
        >
          {/* <div className="flex items-center justify-between px-2 py-3 border-b border-gray-100">
            {!collapsed && (
              <img
                src="/logo.png"
                alt="Acme Health Logo"
                className="h-12 w-auto drop-shadow-sm"
              />
            )}

            <button
  onClick={() => setCollapsed(!collapsed)}
  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-transform duration-200"
  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
>
  <ChevronLeft
    className={`w-5 h-5 transition-transform duration-200 ${
      collapsed ? "rotate-180" : ""
    }`}
  />
</button>

          </div> */}
          <div className="flex items-center justify-center relative px-2 py-3 border-b border-gray-100">
            {!collapsed && (
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="Acme Health Logo"
                  className="h-12 w-auto drop-shadow-sm cursor-pointer"
                />
              </Link>
            )}

            {/* Keep collapse button absolutely positioned */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute right-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-transform duration-200"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-200 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-6 overflow-y-auto hide-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title}>
                {!collapsed && (
                  <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
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
                        {!collapsed && (
                          <span className="font-medium">{link.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        {/* <div className="flex-1 ml-72 flex flex-col overflow-hidden"> */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            collapsed ? "ml-20" : "ml-72"
          }`}
        >
          {/* Header */}
          <header className="h-16 bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 flex items-center justify-between px-6 space-x-4 relative z-[60]">
            {/* <div className="flex items-center text-sm font-semibold text-indigo-600">
            (This is a Non-PHI Sandbox with synthetic data)
            </div> */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-indigo-600">
                Health Data Gateway
              </span>
              <span className="text-sm text-gray-500">
                (This is a Non-PHI Sandbox with synthetic data)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <EHRDropdown
                ehr={ehr}
                setEhr={setEhr}
                setParentEhr={setParentEhr}
                setChildEhr={setChildEhr}
              />

              {/* <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="appearance-none bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {departments.map((deptId) => (
                  <option key={deptId} value={deptId}>
                    Department {deptId}
                  </option>
                ))}
              </select> */}
              {/* <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}

              {/* Docs & Git */}
              <div className="flex items-center gap-3">
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

          {/* Outlet */}
          <main className="flex-1 overflow-y-auto hide-scrollbar">
            <Outlet />
          </main>

          <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
            {/* <div className="group relative flex items-center justify-end cursor-pointer select-none">
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
            </div> */}
            {/* 
            <button
              onClick={handleGetCurlClick}
              className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 hover:shadow-indigo-500/30 transition-all duration-300 focus:outline-none"
              aria-label="Get Curl"
            >
              <Code2 className="w-5 h-5" />
            </button> */}
          </div>

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
                  <DownloadCloud className="w-4 h-4" /> Copy to Clipboard
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

      {/* Powered by XCaliber */}
      {/* <div className="fixed bottom-8 right-4 flex flex-col items-center text-gray-600 opacity-90 pointer-events-none z-50">
  <span className="font-semibold text-sm mb-1 ml-[2px]">Powered by</span>
  <img src="/XCaliber.png" alt="XCaliber Logo" className="h-16 w-auto" />
</div> */}
      {/* Powered by XCaliber */}
      <div className="fixed bottom-4 right-4 flex items-center gap-1 text-gray-600 opacity-90 z-50 pointer-events-none">
        <span className="text-xs font-semibold">Powered by</span>
        <img src="/favicon.png" alt="XCaliber Logo" className="h-3 w-auto" />
      </div>
    </AppContext.Provider>
  );
}
