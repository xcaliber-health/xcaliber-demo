// React Imports
import { useEffect, useState } from "react";

// Mui Imports
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
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
import dayjs from "dayjs";
import { FaPen } from "react-icons/fa";
import { MedicationService } from "../../../../../../services/medicationService";
import { ReferenceDataService } from "../../../../../../services/referenceDataService";

interface ICreateOrEditMedicationProps {
  patientId: string;
  onMedicationClick?: () => void;
  mode: "create" | "edit";
  medicationId?: string;
}

interface IMedicationOption {
  medicationid: string;
  medication: string;
}

interface IStopReasonOption {
  stopreasonid: string;
  stopreason: string;
}

export const CreateOrEditMedication = ({
  patientId,
  onMedicationClick,
  mode,
  medicationId,
}: ICreateOrEditMedicationProps) => {
  const [medicationOptions, setMedicationOptions] = useState<
    IMedicationOption[]
  >([]);
  const [stopReasonOptions, setStopReasonOptions] = useState<
    IStopReasonOption[]
  >([]);
  const [medication, setMedication] = useState<string | "">("");
  const [medicationStopReason, setMedicationStopReason] = useState(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [stopDate, setStopDate] = useState<dayjs.Dayjs | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [stopReasonError, setStopReasonError] = useState(false);
  const [loading, setLoading] = useState(false);

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

    if (mode === "edit" && !medicationStopReason && !stopReasonError) {
      setStopReasonError(true);
      return;
    } else if (stopReasonError) {
      setStopReasonError(false);
    }

    const payload = {
      context: {
        departmentId: localStorage.getItem(`DEPARTMENT_ID`),
      },
      data: {
        resourceType: "MedicationStatement",
        subject: {
          reference: `Patient/${patientId}`,
        },
        medicationCodeableConcept: {
          coding: [
            {
              code: medication,
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
                display: mode === "create" ? null : medicationStopReason,
              },
            ],
          },
        ],
      },
    };

    try {
      if (mode === "create") {
        await MedicationService.createMedicationInAthena(payload);
      } else {
        await MedicationService.updateMedicationInAthena(medicationId, payload);
      }
    } catch (error) {
      console.error(error);
    }
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchMedicationById = async () => {
      if (mode === "edit" && medicationId) {
        try {
          const response = await MedicationService.getMedicationById(
            medicationId,
            patientId
          );

          const medicationSelected = response?.medicationReference?.reference;
          const medicationCode = medicationSelected?.split("/")[1];

          setMedication(medicationCode);
          setStartDate(
            response?.effectivePeriod?.start
              ? dayjs(response?.effectivePeriod?.start)
              : null
          );
          setStopDate(
            response?.effectivePeriod?.end
              ? dayjs(response?.effectivePeriod?.end)
              : null
          );
          setMedicationStopReason(
            response?.statusReason?.[0]?.coding?.[0]?.display
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchMedicationById();
  }, [mode, medicationId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medications, stopReasons] = await Promise.all([
          ReferenceDataService.getMedicationData("ab"),
          ReferenceDataService.getMedicationStopReasonsData(),
        ]);
        setMedicationOptions(medications);
        setStopReasonOptions(stopReasons);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Button
        variant={mode === "edit" ? "outlined" : "contained"}
        color={mode === "edit" ? "inherit" : "primary"}
        className="mr-12"
        sx={{
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Medication</InputLabel>
            <Select
              label="medication"
              value={medication}
              onChange={(e) => {
                setMedication(e.target.value);
              }}
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
                onChange={(date) => setStartDate(date ? dayjs(date) : null)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DesktopDatePicker
                label="Stop Date"
                value={stopDate}
                onChange={(date) => setStopDate(date ? dayjs(date) : null)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Stop Reason</InputLabel>
            <Select
              label="stop-reason"
              value={medicationStopReason || ""}
              onChange={(e) => setMedicationStopReason(e.target.value)}
            >
              {stopReasonOptions?.map((option) => (
                <MenuItem key={option.stopreasonid} value={option.stopreason}>
                  {option.stopreason}
                </MenuItem>
              ))}
            </Select>
            {stopReasonError && (
              <FormHelperText>Stop Reason is required.</FormHelperText>
            )}
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
