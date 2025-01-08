// Next Imports
import dynamic from "next/dynamic";

// MUI Imports
import Grid from "@mui/material/Grid";

// Component Imports
import PatientRightView from "./views/right-view/PatientRightView";
import PatientSidebar from "./views/left-view/PatientSidebar";
const OverViewTab = dynamic(
  () => import("./views/right-view/overview-tab/OverviewTab")
);
const NotesTab = dynamic(() => import("./views/right-view/NotesTab"));
const CareTeamTab = dynamic(() => import("./views/right-view/CareTeamTab"));
const BillingDetailsTab = dynamic(
  () => import("./views/right-view/BillingTab")
);

// Vars
const tabContentList = (id) => [
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
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <PatientSidebar />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <PatientRightView tabContentList={tabContentList(id)} />
      </Grid>
    </Grid>
  );
};

export default PatientDetails;
