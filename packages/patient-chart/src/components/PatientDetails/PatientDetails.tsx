// Component Imports
import PatientSidebar from "./views/left-view/PatientSidebar";
import BillingDetailsTab from "./views/right-view/BillingTab";
import CareTeamTab from "./views/right-view/CareTeamTab";
import NotesTab from "./views/right-view/NotesTab";
import OverViewTab from "./views/right-view/overview-tab/OverviewTab";
import PatientRightView from "./views/right-view/PatientRightView";

// Vars
const tabContentList = (id:any) => [
  { label: "Overview", value: "overview", content: <OverViewTab id={id} /> },
  { label: "Notes", value: "notes", content: <NotesTab /> },
  { label: "Care Team", value: "care-team", content: <CareTeamTab /> },
  {
    label: "Billing Details",
    value: "billing-details",
    content: <BillingDetailsTab />,
  },
];

interface PatientDetailsProps {
  id?: string;
}

const PatientDetails = ({ id }: PatientDetailsProps) => {
  return (
    <div
      style={{
        display: "flex",
        height: "fit-content",
        backgroundColor: "#f4f2f2",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f4f2f2",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <PatientSidebar id={id || ""} />
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: 3,
          backgroundColor: "#f4f2f2",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <PatientRightView tabContentList={tabContentList(id)} />
      </div>
    </div>
  );
};

export default PatientDetails;
