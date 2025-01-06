import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import { VitalService } from "../../services/vitalService";
import { useEffect, useState } from "react";

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
    <div className='p-4'>
      <Button
        variant='outlined'
        onClick={() => window.history.back()}
        style={{ marginBottom: "20px" }}
      >
        Back to Patient List
      </Button>

      <Card>
        <CardHeader title={`Patient Details - ${id}`} />
      </Card>
    </div>
  );
}

export default PatientDetails;
