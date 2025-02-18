import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import LabResults from "./lab-results";
import PatientDetails from "./patient-details";
import PatientDetailsTab from "./PatientDetailsTab";
import Laborder from "./lab-order";

const LabOrderDetails = () => {
  return (
    <Tabs defaultValue="patient-details" className="h-full w-full bg-[#F8FAFC] ">
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
        {/* <PatientDetails /> */}
        <PatientDetailsTab />
      </TabsContent>
      <TabsContent value="lab-order" className="p-4">
        <Laborder />
      </TabsContent>
      <TabsContent value="lab-results" className="p-4">
        <LabResults />
      </TabsContent>
    </Tabs>
  );
};

export default LabOrderDetails;
