import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";

interface PatientDetailsProps {
  id?: string;
}

function PatientDetails({ id }: PatientDetailsProps) {
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
