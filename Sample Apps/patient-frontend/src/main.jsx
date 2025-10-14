import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import DashboardLayout from "./layouts/DashboardLayout";
import AppointmentDashboard from "./pages/AppointmentDashboard";
import PatientList from "./pages/PatientList";
import PatientChart from "./pages/PatientChart2";
import ProviderSearch from "./pages/ProviderSearch";
import SlotsPage from "./pages/SlotsPage";
import ConfirmBooking from "./pages/ConfirmBooking";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/scheduling" element={<AppointmentDashboard />} />
        <Route path="/" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientChart />} />
        <Route path="/scheduling/providerSearch" element={<ProviderSearch />} />
        <Route path="/scheduling/slots/:providerId" element={<SlotsPage />} />
        <Route path="/scheduling/confirm/:slotId" element={<ConfirmBooking />} />

      </Route>
    </Routes>
  </BrowserRouter>
);
