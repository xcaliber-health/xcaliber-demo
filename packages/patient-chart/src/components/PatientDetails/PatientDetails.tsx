import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { VitalService } from "../../services/vitalService";
import PatientSidebar from "./PatientSidebar";
import MedicationsTable from "./MedicationsDetails";

interface PatientDetailsProps {
  id?: string;
}

function PatientDetails({ id }: PatientDetailsProps) {
  const [vitals, setVitals] = useState<any[]>([]);

  useEffect(() => {
    const fetchVitals = async () => {
      const vitals = await VitalService.getVitals(id);
      setVitals(vitals);
    };

    fetchVitals();
  }, []);

  console.log(vitals);

  return (
    <div className="p-4">
      <Button
        variant="outlined"
        onClick={() => window.history.back()}
        style={{ marginBottom: "20px" }}
      >
        Back to Patient List
      </Button>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} md={5}>
          <PatientSidebar id={id || ""} />
        </Grid>
        <Grid item xs={12} lg={8} md={7}>
          <MedicationsTable id={id || ""} />
        </Grid>
      </Grid>
    </div>
  );
}

export default PatientDetails;
