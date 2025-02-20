import React, { useState } from "react";
import { Tabs, TabsContent } from "./ui/tabs";
import LabResults from "./LabResults";
import PatientDetailsTab from "./PatientDetailsTab";
import LabOrder from "./LabOrder";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "./ui/dialog";
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

  if (!patientId) return <></>;

  return (
    <div className="relative h-full w-full bg-[#F8FAFC]">
      {/* Patient Details as Main Content */}
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

        {/* Sidebar Content */}
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

          {/* Navigation Items */}
          <div className="space-y-4">
            {/* Lab Order Button */}
            <Dialog
              open={openLabOrderModal}
              onOpenChange={setOpenLabOrderModal}
            >
              <DialogTrigger asChild>
                <Card
                  className="w-full h-16 flex items-center gap-4 justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 border-gray-200 px-4"
                  onClick={() => setOpenLabOrderModal(true)}
                >
                  <FileText className="w-6 h-6 text-blue-500" />
                  <p className="text-md font-medium text-gray-800">Lab Order</p>
                </Card>
              </DialogTrigger>
              <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col">
                {/* ✅ Removed extra border line */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Lab Order
                  </h2>
                  <Button
                    variant="outline"
                    className="p-2"
                    onClick={() => setOpenLabOrderModal(false)}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </Button>
                </div>

                {/* Modal Content */}
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
                  className="w-full h-16 flex items-center gap-4 justify-center rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 border-gray-200 px-4"
                  onClick={() => setOpenLabResultsModal(true)}
                >
                  <HeartPulse className="w-6 h-6 text-blue-500" />
                  <p className="text-md font-medium text-gray-800">
                    Lab Results
                  </p>
                </Card>
              </DialogTrigger>
              <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col">
                {/* ✅ Removed extra border line */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Lab Results
                  </h2>
                  <Button
                    variant="outline"
                    className="p-2"
                    onClick={() => setOpenLabResultsModal(false)}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </Button>
                </div>

                {/* Modal Content */}
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
    </div>
  );
};

export default LabOrderDetails;
