import React, { useState } from "react";
import { Tabs, TabsContent } from "./ui/tabs";
import LabResults from "./LabResults";
import PatientDetailsTab from "./PatientDetailsTab";
import LabOrder from "./LabOrder";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { Menu, X, ClipboardList, FileText, HeartPulse } from "lucide-react";
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

  if (!patientId) return <></>;

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  return (
    <div className="relative h-full w-full bg-[#F8FAFC]">
      {/* Tabs Content */}
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
          />
        </TabsContent>
        <TabsContent value="lab-order" className="p-4">
          <LabOrder
            patientId={patientId}
            categoryCode="363679005"
            departmentId={departmentId}
            encounterId={encounterId}
            sourceId={sourceId}
            practitionerId={practitionerId}
            practiceId={practiceId}
          />
        </TabsContent>
        <TabsContent value="lab-results" className="p-4">
          <LabResults
            patientId={patientId}
            departmentId={departmentId}
            sourceId={sourceId}
          />
        </TabsContent>
      </Tabs>

      {/* Sidebar Button */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed top-4 right-4 z-50 bg-white border-gray-300 shadow-md hover:bg-gray-100 p-2 rounded-full"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </SheetTrigger>

        {/* Sidebar Content with Rounded Outer Edges */}
        <SheetContent
          side="right"
          className="w-72 p-6 bg-white shadow-lg overflow-y-auto rounded-l-2xl"
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
            <Button
              variant="outline"
              className="p-1"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-700" />
            </Button>
          </div>

          {/* Navigation Items as Cards */}
          <div className="space-y-4">
            <Card
              className={`w-full p-4 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedTab === "patient-details"
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white hover:bg-gray-100 border-gray-200"
              }`}
              onClick={() => handleTabChange("patient-details")}
            >
              <ClipboardList className="w-6 h-6 text-blue-500" />
              <p className="text-md font-medium text-gray-800">
                Patient Details
              </p>
            </Card>

            <Card
              className={`w-full p-4 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedTab === "lab-order"
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white hover:bg-gray-100 border-gray-200"
              }`}
              onClick={() => handleTabChange("lab-order")}
            >
              <FileText className="w-6 h-6 text-blue-500" />
              <p className="text-md font-medium text-gray-800">Lab Order</p>
            </Card>

            <Card
              className={`w-full p-4 flex items-center gap-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedTab === "lab-results"
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white hover:bg-gray-100 border-gray-200"
              }`}
              onClick={() => handleTabChange("lab-results")}
            >
              <HeartPulse className="w-6 h-6 text-blue-500" />
              <p className="text-md font-medium text-gray-800">Lab Results</p>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LabOrderDetails;
