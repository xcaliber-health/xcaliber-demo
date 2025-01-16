// MUI Imports
import Grid from "@mui/material/Grid";

// Component Imports
import AllergiesTable from "./AllergiesDetails";
import ImmunizationsTable from "./ImmunizationDetails";
import MedicationsTable from "./MedicationsDetails";
import ProblemsTable from "./problems/ProblemDetails";
import VitalsTable from "./VitalDetails";

// const getData = async () => {
//   const res = await fetch(`${process.env.API_URL}/apps/invoice`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch invoice data");
//   }

//   return res.json();
// };

interface OverViewTabProps {
  id?: string;
}

const OverViewTab = ({ id }: OverViewTabProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <VitalsTable id={id} />
      </Grid>
      <Grid item xs={12}>
        <ProblemsTable id={id} />
      </Grid>
      <Grid item xs={12}>
        <AllergiesTable id={id} />
      </Grid>
      <Grid item xs={12}>
        <MedicationsTable id={id} />
      </Grid>
      <Grid item xs={12}>
        <ImmunizationsTable id={id} />
      </Grid>
    </Grid>
  );
};

export default OverViewTab;
