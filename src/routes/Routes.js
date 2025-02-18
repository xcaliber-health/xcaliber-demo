import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmartOnFhir from "./pages/SmartOnFhir";
import FhirApp from "./pages/FhirApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/smart-on-fhir" element={<SmartOnFhir />} />
        <Route path="/fhir-app" element={<FhirApp />} />
      </Routes>
    </Router>
  );
}

export default App;
