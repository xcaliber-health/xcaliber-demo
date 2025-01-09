// MUI Imports
import Grid from "@mui/material/Grid";

// Component Imports
import VitalsTable from "./VitalDetails";
import ProblemsTable from "./ProblemDetails";
import AllergiesTable from "./AllergiesDetails";

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
        <ProblemsTable />
      </Grid>
      <Grid item xs={12}>
        <AllergiesTable id={id} />
      </Grid>
    </Grid>
  );
};

export default OverViewTab;
