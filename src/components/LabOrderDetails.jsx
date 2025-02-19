import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import LabResults from "./lab-results";
import PatientDetailsTab from "./PatientDetailsTab";
import LabOrder from "./LabOrder";

const LabOrderDetails = ({
  patientId = 4406,
  encounterId = 46318,
  sourceId,
  departmentId,
  practitionerId,
  practiceId
}) => {
  if (!patientId) return <></>;
  return (
    <Tabs
      defaultValue="patient-details"
      className="h-full w-full bg-[#F8FAFC] "
    >
      <TabsList className="rounded-none h-auto bg-white w-full flex justify-start">
        <TabsTrigger
          value="patient-details"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 bg-transparent px-2 py-4 font-medium text-gray-600 hover:bg-transparent"
        >
          PATIENT DETAILS
        </TabsTrigger>
        <TabsTrigger
          value="lab-order"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 bg-transparent px-2 py-4 font-medium text-gray-600 hover:bg-transparent"
        >
          LAB ORDER
        </TabsTrigger>
        <TabsTrigger
          value="lab-results"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 bg-transparent px-2 py-4 font-medium text-gray-600 hover:bg-transparent"
        >
          LAB RESULTS
        </TabsTrigger>
      </TabsList>
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
        {/* <LabResults /> */}
      </TabsContent>
    </Tabs>
  );
};

export default LabOrderDetails;
