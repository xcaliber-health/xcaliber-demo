
// import React, { useState, useEffect } from "react";
// import { FileSignature, ChevronDown, ChevronRight } from "lucide-react";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// // Metadata section
// const MetadataSection = ({ metadata }) => {
//   if (!metadata) return null;

//   const formatValue = (key, val) => {
//     if (val === null || val === undefined) return null;
//     if (typeof val === "boolean") return val ? "Yes" : "No";
//     if (key.toLowerCase().includes("date")) return new Date(val).toLocaleDateString();
//     if (Array.isArray(val) || typeof val === "object") return JSON.stringify(val, null, 2);
//     return val;
//   };

//   return (
//     <div className="text-xs">
//       {Object.entries(metadata).map(([key, value]) => {
//         const val = formatValue(key, value);
//         if (val === null) return null;

//         const label = key
//           .split("_")
//           .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//           .join(" ");

//         return (
//           <div key={key} className="mb-1">
//             <div className="text-xs text-gray-600">{label}</div>
//             <div className="text-sm font-semibold">{val}</div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // Custom cell renderer for "codes" field displaying them nicely
// const CodesCell = ({ codes }) => {
//   if (!Array.isArray(codes) || codes.length === 0) return null;

//   return (
//     <div className="space-y-1">
//       {codes.map((codeObj, i) => (
//         <div
//           key={i}
//           className="border border-gray-100 rounded p-1 bg-gray-50 text-[11px]"
//         >
//           {codeObj.terminology && (
//             <div>
//               <span className="text-gray-600">Terminology:</span> {codeObj.terminology}
//             </div>
//           )}
//           {codeObj.code && (
//             <div>
//               <span className="text-gray-600">Code:</span> {codeObj.code}
//             </div>
//           )}
//           {codeObj.name && (
//             <div>
//               <span className="text-gray-600">Name:</span> {codeObj.name}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// // EntityCard component for collapsible table with columns filtered if all null/empty;
// // and custom display for "codes" column instead of JSON stringifying
// const EntityCard = ({ title, items, open, toggleOpen }) => {
//   if (!items || items.length === 0) return null;

//   const allHeaders = Object.keys(items[0]);

//   // Filter out columns where all values are null/undefined/empty string
//   const headers = allHeaders.filter((header) =>
//     items.some(
//       (item) =>
//         item[header] !== null &&
//         item[header] !== undefined &&
//         !(typeof item[header] === "string" && item[header].trim() === "")
//     )
//   );

//   if (headers.length === 0) return null; // If no valid headers, don't show table

//   return (
//     <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 mb-4">
//       <button
//         onClick={toggleOpen}
//         className="w-full flex justify-between items-center px-4 py-2 rounded-t-xl font-medium hover:bg-gray-100"
//       >
//         <div className="flex items-center gap-2">
//           {open ? (
//             <ChevronDown className="w-4 h-4 text-indigo-600" />
//           ) : (
//             <ChevronRight className="w-4 h-4 text-indigo-600" />
//           )}
//           <span className="capitalize">{title}</span>
//           <span className="text-xs text-gray-500">({items.length})</span>
//         </div>
//       </button>

//       {open && (
//         <div className="overflow-x-auto p-4">
//           <table className="min-w-full text-sm text-left border rounded-lg">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 {headers.map((header) => (
//                   <th key={header} className="px-3 py-2 border">
//                     {header.charAt(0).toUpperCase() + header.slice(1)}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50">
//                   {headers.map((field) => (
//                     <td key={field} className="px-3 py-2 border align-top">
//                       {field === "codes" && item[field] ? (
//                         <CodesCell codes={item[field]} />
//                       ) : typeof item[field] === "object" && item[field] !== null ? (
//                         JSON.stringify(item[field])
//                       ) : (
//                         String(item[field])
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// // EntitiesSection with collapsible entity tables
// const EntitiesSection = ({ entities, openSections, toggleSection }) => {
//   if (!entities) return null;

//   return (
//     <>
//       {Object.entries(entities).map(([section, items]) => {
//         if (!Array.isArray(items) || items.length === 0) return null;
//         return (
//           <EntityCard
//             key={section}
//             title={section}
//             items={items}
//             open={openSections[section]}
//             toggleOpen={() => toggleSection(section)}
//           />
//         );
//       })}
//     </>
//   );
// };

// export default function DocumentLabeling() {
//   const [pdfFiles, setPdfFiles] = useState([]);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [pdfData, setPdfData] = useState(null);
//   const [metadata, setMetadata] = useState(null);
//   const [entities, setEntities] = useState(null);
//   const [activeTab, setActiveTab] = useState("metadata");
//   const [openSections, setOpenSections] = useState({});

//   const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   useEffect(() => {
//     const fetchPdfList = async () => {
//       try {
//         const res = await fetch(
//           "https://blitz.xcaliberapis.com/sample/bff/labeldocuments"
//         );
//         const data = await res.json();
//         setPdfFiles(data.documents || []);
//         if (data.documents?.length > 0) setSelectedPdf(data.documents[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchPdfList();
//   }, []);

//   useEffect(() => {
//     if (!selectedPdf) return;

//     const fetchPdfData = async () => {
//       try {
//         const resPdf = await fetch(
//           `https://blitz.xcaliberapis.com/sample/bff/labeldocuments/${selectedPdf}/pdf`
//         );
//         const dataPdf = await resPdf.json();
//         setPdfData(dataPdf.base64);

//         const resMeta = await fetch(`/metadata/${selectedPdf}.json`);
//         const dataMeta = await resMeta.json();
//         setMetadata(dataMeta);

//         const resEntities = await fetch(`/entities/${selectedPdf}.json`);
//         const dataEntities = await resEntities.json();
//         setEntities(dataEntities);

//         // Reset open sections when entities change
//         const initialOpen = {};
//         Object.keys(dataEntities || {}).forEach((key) => {
//           initialOpen[key] = false;
//         });
//         setOpenSections(initialOpen);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchPdfData();
//   }, [selectedPdf]);

//   const toggleSection = (key) =>
//     setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

//   const pdfDisplayNames = pdfFiles.reduce((acc, file, index) => {
//     if (index === 0) acc[file] = "Diagnostic Report";
//     else if (index === 1) acc[file] = "Discharge Summary";
//     else acc[file] = file;
//     return acc;
//   }, {});

//   return (
//     <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
//       <div className="flex-shrink-0 p-4 pb-2">
//         <div className="max-w-7xl mx-auto flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//             <FileSignature className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               AI-Ready Labeled Dataset
//             </h1>
//             <p className="text-sm text-gray-600">View and label PDF documents</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 px-4 pb-4 overflow-hidden min-h-0">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* PDF Viewer */}
//           <div className="flex flex-col overflow-hidden flex-1 max-h-[750px]">
//             {/* PDF Tabs */}
//             <div className="border-b border-gray-300 flex">
//               {pdfFiles.map((file) => (
//                 <div
//                   key={file}
//                   onClick={() => setSelectedPdf(file)}
//                   className={`cursor-pointer px-4 py-2 -mb-px ${
//                     selectedPdf === file
//                       ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
//                       : "text-gray-600 hover:text-indigo-600"
//                   }`}
//                 >
//                   {pdfDisplayNames[file] || file}
//                 </div>
//               ))}
//             </div>

//             <div className="flex-1 border rounded-lg overflow-auto bg-white shadow-xl min-h-0">
//               {pdfData ? (
//                 <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
//                   <div className="h-full min-h-[500px]">
//                     <Viewer
//                       fileUrl={`data:application/pdf;base64,${pdfData}`}
//                       plugins={[defaultLayoutPluginInstance]}
//                       style={{ height: "100%" }}
//                     />
//                   </div>
//                 </Worker>
//               ) : (
//                 <p className="p-4 text-gray-500">Loading PDF...</p>
//               )}
//             </div>
//           </div>

//           {/* Labels / Entities Tabs */}
//           <div className="flex flex-col overflow-hidden flex-1 max-h-[750px]">
//             <div className="border-b border-gray-300 flex mb-2">
//               <div
//                 onClick={() => setActiveTab("metadata")}
//                 className={`cursor-pointer px-4 py-2 -mb-px ${
//                   activeTab === "metadata"
//                     ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
//                     : "text-gray-600 hover:text-indigo-600"
//                 }`}
//               >
//                 Labels
//               </div>
//               <div
//                 onClick={() => setActiveTab("entities")}
//                 className={`cursor-pointer px-4 py-2 -mb-px ${
//                   activeTab === "entities"
//                     ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
//                     : "text-gray-600 hover:text-indigo-600"
//                 }`}
//               >
//                 Entities
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg shadow min-h-0">
//               {activeTab === "metadata" && <MetadataSection metadata={metadata} />}
//               {activeTab === "entities" && (
//                 <EntitiesSection
//                   entities={entities}
//                   openSections={openSections}
//                   toggleSection={toggleSection}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { FileSignature, ChevronDown, ChevronRight } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Inject scrollbar-hide CSS
const ScrollbarHideStyle = () => (
  <style>{`
    /* Hide horizontal scrollbar but allow scrolling */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;     /* Firefox */
    }
  `}</style>
);

// Metadata section
const MetadataSection = ({ metadata }) => {
  if (!metadata) return null;

  const formatValue = (key, val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (key.toLowerCase().includes("date")) return new Date(val).toLocaleDateString();
    if (Array.isArray(val) || typeof val === "object") return JSON.stringify(val, null, 2);
    return val;
  };

  return (
    <div className="text-xs">
      {Object.entries(metadata).map(([key, value]) => {
        const val = formatValue(key, value);
        if (val === null) return null;

        const label = key
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        return (
          <div key={key} className="mb-1">
            <div className="text-xs text-gray-600">{label}</div>
            <div className="text-sm font-semibold">{val}</div>
          </div>
        );
      })}
    </div>
  );
};

// Custom cell renderer for "codes" field
const CodesCell = ({ codes }) => {
  if (!Array.isArray(codes) || codes.length === 0) return null;

  return (
    <div className="space-y-1">
      {codes.map((codeObj, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded p-1 bg-gray-50 text-[11px]"
        >
          {codeObj.terminology && (
            <div>
              <span className="text-gray-600">Terminology:</span> {codeObj.terminology}
            </div>
          )}
          {codeObj.code && (
            <div>
              <span className="text-gray-600">Code:</span> {codeObj.code}
            </div>
          )}
          {codeObj.name && (
            <div>
              <span className="text-gray-600">Name:</span> {codeObj.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// EntityCard component
const EntityCard = ({ title, items, open, toggleOpen }) => {
  if (!items || items.length === 0) return null;

  const allHeaders = Object.keys(items[0]);

  const headers = allHeaders.filter((header) =>
    items.some(
      (item) =>
        item[header] !== null &&
        item[header] !== undefined &&
        !(typeof item[header] === "string" && item[header].trim() === "")
    )
  );

  if (headers.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 mb-4">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center px-4 py-2 rounded-t-xl font-medium hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-4 h-4 text-indigo-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          )}
          <span className="capitalize">{title}</span>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
      </button>

      {open && (
        <div className="overflow-x-auto p-4 scrollbar-hide">
          <table className="min-w-full text-sm text-left border rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-3 py-2 border">
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {headers.map((field) => (
                    <td key={field} className="px-3 py-2 border align-top">
                      {field === "codes" && item[field] ? (
                        <CodesCell codes={item[field]} />
                      ) : typeof item[field] === "object" && item[field] !== null ? (
                        JSON.stringify(item[field])
                      ) : (
                        String(item[field])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// EntitiesSection
const EntitiesSection = ({ entities, openSections, toggleSection }) => {
  if (!entities) return null;

  return (
    <>
      {Object.entries(entities).map(([section, items]) => {
        if (!Array.isArray(items) || items.length === 0) return null;
        return (
          <EntityCard
            key={section}
            title={section}
            items={items}
            open={openSections[section]}
            toggleOpen={() => toggleSection(section)}
          />
        );
      })}
    </>
  );
};

export default function DocumentLabeling() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [entities, setEntities] = useState(null);
  const [activeTab, setActiveTab] = useState("metadata");
  const [openSections, setOpenSections] = useState({});

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchPdfList = async () => {
      try {
        const res = await fetch(
          "https://blitz.xcaliberapis.com/sample/bff/labeldocuments"
        );
        const data = await res.json();
        setPdfFiles(data.documents || []);
        if (data.documents?.length > 0) setSelectedPdf(data.documents[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPdfList();
  }, []);

  useEffect(() => {
    if (!selectedPdf) return;

    const fetchPdfData = async () => {
      try {
        const resPdf = await fetch(
          `https://blitz.xcaliberapis.com/sample/bff/labeldocuments/${selectedPdf}/pdf`
        );
        const dataPdf = await resPdf.json();
        setPdfData(dataPdf.base64);

        const resMeta = await fetch(`/metadata/${selectedPdf}.json`);
        const dataMeta = await resMeta.json();
        setMetadata(dataMeta);

        const resEntities = await fetch(`/entities/${selectedPdf}.json`);
        const dataEntities = await resEntities.json();
        setEntities(dataEntities);

        const initialOpen = {};
        Object.keys(dataEntities || {}).forEach((key) => {
          initialOpen[key] = false;
        });
        setOpenSections(initialOpen);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPdfData();
  }, [selectedPdf]);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const pdfDisplayNames = pdfFiles.reduce((acc, file, index) => {
    if (index === 0) acc[file] = "Diagnostic Report";
    else if (index === 1) acc[file] = "Discharge Summary";
    else acc[file] = file;
    return acc;
  }, {});

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <ScrollbarHideStyle />
      <div className="flex-shrink-0 p-4 pb-2">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileSignature className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Ready Labeled Dataset
            </h1>
            <p className="text-sm text-gray-600">View and label PDF documents</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-4 overflow-hidden min-h-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF Viewer */}
          <div className="flex flex-col overflow-hidden flex-1 max-h-[750px]">
            <div className="border-b border-gray-300 flex">
              {pdfFiles.map((file) => (
                <div
                  key={file}
                  onClick={() => setSelectedPdf(file)}
                  className={`cursor-pointer px-4 py-2 -mb-px ${
                    selectedPdf === file
                      ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {pdfDisplayNames[file] || file}
                </div>
              ))}
            </div>

            <div className="flex-1 border rounded-lg overflow-auto bg-white shadow-xl min-h-0">
              {pdfData ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                  <div className="h-full min-h-[500px]">
                    <Viewer
                      fileUrl={`data:application/pdf;base64,${pdfData}`}
                      plugins={[defaultLayoutPluginInstance]}
                      style={{ height: "100%" }}
                    />
                  </div>
                </Worker>
              ) : (
                <p className="p-4 text-gray-500">Loading PDF...</p>
              )}
            </div>
          </div>

          {/* Labels / Entities Tabs */}
          <div className="flex flex-col overflow-hidden flex-1 max-h-[750px]">
            <div className="border-b border-gray-300 flex mb-2">
              <div
                onClick={() => setActiveTab("metadata")}
                className={`cursor-pointer px-4 py-2 -mb-px ${
                  activeTab === "metadata"
                    ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Labels
              </div>
              <div
                onClick={() => setActiveTab("entities")}
                className={`cursor-pointer px-4 py-2 -mb-px ${
                  activeTab === "entities"
                    ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Entities
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg shadow min-h-0">
              {activeTab === "metadata" && <MetadataSection metadata={metadata} />}
              {activeTab === "entities" && (
                <EntitiesSection
                  entities={entities}
                  openSections={openSections}
                  toggleSection={toggleSection}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
