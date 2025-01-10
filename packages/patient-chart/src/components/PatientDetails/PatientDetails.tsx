// Component Imports
import PatientSidebar from "./views/left-view/PatientSidebar";
import BillingDetailsTab from "./views/right-view/BillingTab";
import CareTeamTab from "./views/right-view/CareTeamTab";
import NotesTab from "./views/right-view/NotesTab";
import OverViewTab from "./views/right-view/overview-tab/OverviewTab";
import PatientRightView from "./views/right-view/PatientRightView";

// React icon imports
import { BiBookmark, BiLock, BiUser } from "react-icons/bi";

// Vars
const tabContentList = (id) => [
  {
    label: "Overview",
    value: "overview",
    icon: <BiUser />,
    content: <OverViewTab id={id} />,
  },
  { label: "Notes", value: "notes", icon: <BiLock />, content: <NotesTab /> },
  {
    label: "Care Team",
    value: "care-team",
    icon: <BiLock />,
    content: <CareTeamTab />,
  },
  {
    label: "Billing Details",
    value: "billing-details",
    icon: <BiBookmark />,
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
        backgroundColor: "#F4F5FA",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#F4F5FA",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <PatientSidebar id={id || ""} />
      </div>
      {/* Right Panel */}
      <div
        style={{
          flex: 3, // 3 parts of the 1:3 ratio
          backgroundColor: "#F4F5FA",
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
