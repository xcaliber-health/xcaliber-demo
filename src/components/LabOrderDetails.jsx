import React, { useState } from "react";
import { Tabs, TabsContent } from "./ui/tabs";
import PatientDetailsTab from "./PatientDetailsTab";
import LabOrder from "./LabOrder";
import LabResults from "./LabResults";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Menu, X, FileText, HeartPulse } from "lucide-react";
import { Card } from "./ui/card";

const LabOrderDetails = ({
  patientId = 4406,
  encounterId = 46318,
  sourceId,
  departmentId,
  practitionerId,
  practiceId,
}) => {
  const [selectedTab, setSelectedTab] = useState("patient-details");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openLabOrderModal, setOpenLabOrderModal] = useState(false);
  const [openLabResultsModal, setOpenLabResultsModal] = useState(false);

  // Prevents content shift when sidebar is open
  React.useEffect(() => {
    if (isSidebarOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [isSidebarOpen]);

  if (!patientId) return <></>;

  return (
    <div
      className="relative min-h-screen w-full bg-[#F8FAFC]"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // Internet Explorer/Edge
        overflow: "hidden",
      }}
    >
      {/* ✅ Centered Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-2 z-40 h-[48px] flex items-center">
        <div className="container mx-auto flex justify-center items-center text-gray-800 text-xs font-medium gap-6">
          <p><strong>Patient ID:</strong> {patientId || "N/A"}</p>
          <p><strong>Encounter ID:</strong> {encounterId || "N/A"}</p>
          <p><strong>Department ID:</strong> {departmentId || "N/A"}</p>
          <p><strong>Practice ID:</strong> {practiceId || "N/A"}</p>
          <p><strong>Practitioner ID:</strong> {practitionerId || "N/A"}</p>
        </div>
      </nav>

      {/* ✅ Hamburger Menu Positioned Above Navbar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed top-2 right-4 z-50 bg-white border-gray-300 shadow-md hover:bg-gray-100 p-2 rounded-full"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </SheetTrigger>

        {/* Sidebar Content - No Breaking Layout */}
        <SheetContent
          side="right"
          className="w-72 p-6 bg-white shadow-lg overflow-y-auto rounded-l-2xl"
          style={{ scrollbarWidth: "none", overflow: "hidden" }} // Hide scrollbar in sidebar
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
            <Button
              variant="outline"
              className="p-1"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-700" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-4">
            {/* Lab Order Button */}
            <Dialog
              open={openLabOrderModal}
              onOpenChange={setOpenLabOrderModal}
            >
              <DialogTrigger asChild>
                <Card
                  className="w-full h-14 flex items-center gap-4 justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 border-gray-200 px-4"
                  onClick={() => setOpenLabOrderModal(true)}
                >
                  <FileText className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-medium text-gray-800">Lab Order</p>
                </Card>
              </DialogTrigger>
              <DialogContent
                className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col mt-[48px]" // Opens below navbar
              >
                <div className="flex items-center justify-end px-4 pt-4">
                  <Button variant="outline" className="p-2" onClick={() => setOpenLabOrderModal(false)}>
                    <X className="w-5 h-5 text-gray-700" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <LabOrder
                    patientId={patientId}
                    categoryCode="108252007"
                    departmentId={departmentId}
                    encounterId={encounterId}
                    sourceId={sourceId}
                    practitionerId={practitionerId}
                    practiceId={practiceId}
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Lab Results Button */}
            <Dialog
              open={openLabResultsModal}
              onOpenChange={setOpenLabResultsModal}
            >
              <DialogTrigger asChild>
                <Card
                  className="w-full h-14 flex items-center gap-4 justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 border-gray-200 px-4"
                  onClick={() => setOpenLabResultsModal(true)}
                >
                  <HeartPulse className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-medium text-gray-800">Lab Results</p>
                </Card>
              </DialogTrigger>
              <DialogContent
                className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col mt-[48px]" // Opens below navbar
              >
                <div className="flex items-center justify-end px-4 pt-4">
                  <Button variant="outline" className="p-2" onClick={() => setOpenLabResultsModal(false)}>
                    <X className="w-5 h-5 text-gray-700" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <LabResults
                    patientId={patientId}
                    departmentId={departmentId}
                    sourceId={sourceId}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </SheetContent>
      </Sheet>

      {/* ✅ Main Content - Positioned Correctly */}
      <div className="pt-[48px] p-4">
        <Tabs defaultValue={selectedTab} value={selectedTab} className="h-full w-full">
          <TabsContent value="patient-details" className="p-4">
            <PatientDetailsTab
              patientId={patientId}
              departmentId={departmentId}
              sourceId={sourceId}
              encounterId={encounterId}
              practitionerId={practitionerId}
              practiceId={practiceId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LabOrderDetails;
