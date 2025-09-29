import React,{useContext} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./layouts/DashboardLayout";
import { AppContext } from "./layouts/DashboardLayout";

// Scheduling pages
import AppointmentDashboard from "./pages/AppointmentDashboard"; // Screen 3
import FindAppointment from "./pages/FindAppointment";           // Screen 1
import BookAppointment from "./pages/BookAppointment";           // Screen 2

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

//DocumentReference Page
import DocumentReference from "./pages/DocumentReference"; 

// Notes App
import NotesApp from "./pages/NotesApp";


// ✅ Wrapper to inject props into VitalsTab
function VitalsTabWrapper() {
  const { id } = useParams();
  const { sourceId } = useContext(AppContext);
  return <VitalsTab patientId={id} sourceId={sourceId} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
      <Route element={<DashboardLayout />}>
      
        {/* Scheduling */}
        <Route path="/scheduling" element={<AppointmentDashboard />} />
        <Route path="/scheduling/find" element={<FindAppointment />} />
        <Route path="/scheduling/book" element={<BookAppointment />} />

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

        {/* ✅ DocumentReference Viewer */}
        <Route path="/document-reference" element={<DocumentReference />} />

        {/* Notes App */}
        <Route path="/notes" element={<NotesApp />} />
        <Route path="/notes/:patientId" element={<NotesApp />} />
        <Route path="/notes/:patientId/:noteId" element={<NotesApp />} />
        
      </Route>

    </Routes>
    {/* ✅ Toast container */}
      <Toaster position="bottom-right" reverseOrder={false} />
  </BrowserRouter>
);
