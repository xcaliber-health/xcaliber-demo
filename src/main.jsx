import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./layouts/DashboardLayout";
import { AppContext } from "./layouts/DashboardLayout";

// Scheduling pages
import AppointmentDashboard from "./pages/AppointmentDashboard"; // Screen 3
import FindAppointment from "./pages/FindAppointment"; // Screen 1
import BookAppointment from "./pages/BookAppointment"; // Screen 2
import VirtualPhone from "./pages/VirtualPhone";

// Patient pages
import PatientList from "./pages/PatientList";
import PatientChart from "./pages/PatientChart2";
import VitalsTab from "./pages/VitalsTab";

// Claims pages
import ClaimsDashboard from "./pages/ClaimsDashboard";
import ClaimDetail from "./pages/ClaimsDetail";
import NewClaim from "./pages/NewClaim";

// Provider directory/profile
import ProviderDirectory from "./pages/ProviderDirectory";

//Fhir Browser
import FhirBrowser from "./pages/FhirBrowser";

// Event Browser
import EventBrowser from "./pages/EventBrowser";

//DocumentReference Page
import DocumentReference from "./pages/DocumentReference";

// Notes App
import NotesApp from "./pages/NotesApp";
import ViewNote from "./pages/ViewNote";
import NewNote from "./pages/NewNote";

// Orders Dashboard
import OrdersDashboard from "./pages/OrdersDashboard";
import CreateOrder from "./pages/CreateOrder";

//Custom Clinical Processing
import ClinicalProcessing from "./pages/ClinicalProcessing";
import RecordingsList from "./pages/RecordingsList";

import BulkDataExtraction from "./pages/BulkDataExtraction";

import ClaimsDataStreaming from "./pages/ClaimsDataStreaming";

import ChartSummarizer from "./pages/ChartSummarize";
import DocumentLabeling from "./pages/DocumentLabeling";
import RawBrowser from "./pages/RawBrowser";
import KnowledgeSource from "./pages/KnowledgeSource";

// ✅ Wrapper to inject props into VitalsTab
function VitalsTabWrapper() {
  const { id } = useParams();
  const { sourceId } = useContext(AppContext);
  return <VitalsTab patientId={id} sourceId={sourceId} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/scheduling/find" replace />} />
      <Route element={<DashboardLayout />}>
        {/* Scheduling */}
        <Route path="/scheduling" element={<AppointmentDashboard />} />
        <Route path="/scheduling/find" element={<FindAppointment />} />
        <Route path="/scheduling/book" element={<BookAppointment />} />
        <Route path="/notifications" element={<VirtualPhone />} />

        {/* Patients */}
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientChart />} />
        <Route path="/patients/:id/vitals" element={<VitalsTabWrapper />} />

        {/* Claims */}
        <Route path="/claims" element={<ClaimsDashboard />} />
        <Route path="/claims/new" element={<NewClaim />} />
        <Route path="/claims/:id" element={<ClaimDetail />} />

        {/* Provider Directory */}
        <Route path="/providerDirectory" element={<ProviderDirectory />} />

        {/*Fhir Browser*/}
        <Route path="/fhir-browser" element={<FhirBrowser />} />

        {/* Event Browser */}
        <Route path="/event-browser" element={<EventBrowser />} />

        {/* ✅ DocumentReference Viewer */}
        <Route path="/document-reference" element={<DocumentReference />} />

        {/* Notes App */}
        <Route path="/notes" element={<NotesApp />} />
        <Route path="/create-note" element={<NewNote />} />
        <Route path="/note/:id" element={<ViewNote />} />

        {/* Orders Dashboard */}
        <Route path="/orders" element={<OrdersDashboard />} />
        <Route path="/orders/create" element={<CreateOrder />} />

        {/* Custom Clinical Processing */}
        <Route
          path="/custom-clinical-processing"
          element={<ClinicalProcessing />}
        />

        <Route path="/scripts" element={<RecordingsList />} />

        <Route path="/bulk-data-extraction" element={<BulkDataExtraction />} />
        {/* Content Integrations */}
        <Route path="/knowledgesource" element={<KnowledgeSource />} />

        <Route path="/claims-streaming" element={<ClaimsDataStreaming />} />
        <Route path="/chart-summary" element={<ChartSummarizer />} />
        <Route path="/raw-browser" element={<RawBrowser />} />

        <Route path="/claims-streaming" element={<ClaimsDataStreaming />} />
        <Route path="/chart-summary" element={<ChartSummarizer />} />
        <Route path="/document-labeling" element={<DocumentLabeling />} />
      </Route>
    </Routes>
    {/* ✅ Toast container */}
    <Toaster position="bottom-right" reverseOrder={false} />
  </BrowserRouter>
);
