// React Imports
import { useEffect, useState } from "react";

// Mui Imports
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

// Third-party Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FaPen } from "react-icons/fa";
import { MedicationService } from "../../../../../../services/medicationService";
import { ReferenceDataService } from "../../../../../../services/referenceDataService";

interface ICreateOrEditMedicationProps {
  patientId: string;
  onMedicationClick?: () => void;
  mode: "create" | "edit";
  medicationId?: string;
}

export const CreateOrEditMedication = ({
  patientId,
  onMedicationClick,
  mode,
  medicationId,
}: ICreateOrEditMedicationProps) => {
  const [medicationOptions, setMedicationOptions] = useState([]);
  const [stopReasonOptions, setStopReasonOptions] = useState([]);
  const [medication, setMedication] = useState<string | "">("");
  const [medicationStopReason, setMedicationStopReason] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [stopDate, setStopDate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      // ReferenceDataService.getMedicationData(""),
      ReferenceDataService.getMedicationData("cyclo"),
      ReferenceDataService.getMedicationStopReasonsData(),
    ])
      .then(([medications, stopReasons]) => {
        setMedicationOptions(medications);
        setStopReasonOptions(stopReasons);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return new Date(
      Date.UTC(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
      )
    ).toISOString();
  };

  const createMedication = async () => {
    if (!medication) return;

    const payload = {
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        resourceType: "MedicationStatement",
        id: String(medication),
        subject: {
          reference: `Patient/${patientId}`,
        },
        medicationCodeableConcept: {
          coding: [
            {
              code: String(medication),
              display: medicationOptions.find(
                (option) => option.medicationid === medication
              )?.medication,
            },
          ],
        },
        note: [],
        informationSource: {
          identifier: {},
        },
        effectivePeriod: {
          start: startDate ? formatDate(startDate) : null,
          end: stopDate ? formatDate(stopDate) : null,
        },
        medicationReference: {
          reference: `Medication/${medication}`,
        },
        statusReason: [
          {
            coding: [
              {
                display: null,
              },
            ],
          },
        ],
      },
    };

    await MedicationService.createMedicationInAthena(payload);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Button
        variant={mode === "edit" ? "outlined" : "contained"}
        color={mode === "edit" ? "inherit" : "primary"}
        className="mr-12"
        style={{
          border: mode === "edit" ? "none" : "",
          marginTop: mode === "edit" ? "-4px" : "",
          marginLeft: mode === "edit" ? "-16px" : "",
          backgroundColor: mode === "edit" ? "transparent" : "",
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        {mode === "create" ? "Add" : <FaPen />}
      </Button>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: "40%", padding: "10px" } }}
      >
        <div className="flex items-center justify-between p-2">
          <Typography variant="h5">
            {mode === "create" ? "Create" : "Edit"} Medication
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <i className="ri-close-line" />
          </IconButton>
        </div>
        <Divider />

        <div style={{ padding: "20px" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Medication</InputLabel>
            <Select
              labelId="medication-label"
              value={medication || ""}
              onChange={(e) => setMedication(e.target.value)}
            >
              {loading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (medicationOptions?.length ?? 0) === 0 ? (
                <MenuItem disabled>No options available</MenuItem>
              ) : (
                medicationOptions?.map((option) => (
                  <MenuItem
                    key={option.medicationid}
                    value={option.medicationid}
                  >
                    {option.medication}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} mt={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DesktopDatePicker
                label="Stop Date"
                value={stopDate}
                onChange={setStopDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Stop Reason</InputLabel>
            <Select
              value={medicationStopReason || ""}
              onChange={(e) => setMedicationStopReason(e.target.value)}
            >
              {stopReasonOptions?.map((option) => (
                <MenuItem key={option.stopreasonid} value={option.stopreasonid}>
                  {option.stopreason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <Button variant="contained" onClick={createMedication}>
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </div>
      </Drawer>
    </>
  );
};
