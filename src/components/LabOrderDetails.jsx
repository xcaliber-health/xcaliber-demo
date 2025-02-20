import { FileText, HeartPulse, Info, Menu, X } from "lucide-react";
import React, { useState } from "react";
import LabOrder from "./LabOrder";
import LabResults from "./LabResults";
import PatientDetailsTab from "./PatientDetailsTab";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsContent } from "./ui/tabs";

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
  const [showInfoCard, setShowInfoCard] = useState(false);

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
      <div className="fixed top-[13px] right-16 z-50 bg-white flex items-center gap-3 rounded-full">
        <div
          className="relative inline-flex items-center justify-center border shadow-md rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200"
          onMouseEnter={() => setShowInfoCard(true)}
          onMouseLeave={() => setShowInfoCard(false)}
        >
          <Info size={26} className="text-gray-600 text-lg" />
        </div>

        {showInfoCard && (
          <div className="absolute top-7 right-6 bg-white border shadow-lg rounded-md p-4 text-gray-800 text-sm font-medium w-64 z-50">
            <p>
              <strong>Patient ID:</strong> {patientId || "N/A"}
            </p>
            <p>
              <strong>Encounter ID:</strong> {encounterId || "N/A"}
            </p>
            <p>
              <strong>Department ID:</strong> {departmentId || "N/A"}
            </p>
            <p>
              <strong>Practice ID:</strong> {practiceId || "N/A"}
            </p>
            <p>
              <strong>Practitioner ID:</strong> {practitionerId || "N/A"}
            </p>
          </div>
        )}
      </div>

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
          className="w-72 p-6 bg-white shadow-lg overflow-y-auto rounded-l-2xl transition-transform duration-300 ease-in-out transform
             translate-x-0"
          style={{ scrollbarWidth: "none", overflow: "hidden" }} // Hide scrollbar in sidebar
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
            <X
              className="w-5 h-5 text-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Navigation Items */}
          <div className="w-full flex flex-col space-y-4">
            {/* Lab Order Button */}
            <Dialog
              open={openLabOrderModal}
              onOpenChange={setOpenLabOrderModal}
            >
              <DialogTrigger asChild>
                <Card
                  className="w-full h-14 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 border-gray-200 px-4"
                  onClick={() => {
                    // setIsSidebarOpen(false);
                    setOpenLabOrderModal(true);
                  }}
                >
                  <FileText className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-medium text-gray-800">Lab Order</p>
                </Card>
              </DialogTrigger>
              <DialogContent
                className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col mt-[48px]" // Opens below navbar
              >
                <div className="flex items-center justify-end px-4 pt-4">
                  <Button
                    variant="outline"
                    className="p-2"
                    onClick={() => {
                      setOpenLabOrderModal(false);
                    }}
                  >
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
                  className="w-full h-14 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 border-gray-200 px-4"
                  onClick={() => {
                    // setIsSidebarOpen(false);
                    setOpenLabResultsModal(true);
                  }}
                >
                  <HeartPulse className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-medium text-gray-800">
                    Lab Results
                  </p>
                </Card>
              </DialogTrigger>
              <DialogContent
                className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col mt-[48px]" // Opens below navbar
              >
                <div className="flex items-center justify-end px-4 pt-4">
                  <Button
                    variant="outline"
                    className="p-2"
                    onClick={() => setOpenLabResultsModal(false)}
                  >
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
      <div className="pt-4 p-4">
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          className="h-full w-full"
        >
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
