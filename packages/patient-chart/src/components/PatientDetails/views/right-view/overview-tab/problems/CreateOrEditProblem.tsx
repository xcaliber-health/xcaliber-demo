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
import * as moment from "moment-timezone";
import { ProblemService } from "../../../../../../services/problemService";
import { ReferenceDataService } from "../../../../../../services/referenceDataService";

// React Icons
import { FaPen } from "react-icons/fa";

interface CreateOrEditProblemProps {
  patientId: string;
  problemId?: string;
  updateProblems: (data: any) => void;
  mode: "create" | "edit";
}

export const CreateOrEditProblem = ({
  patientId,
  problemId,
  updateProblems,
  mode,
}: CreateOrEditProblemProps) => {
  let dateObject = new Date(
    new Date().toLocaleString(`en-US`, {
      timeZone: localStorage.getItem(`DEPARTMENT_TIMEZONE`),
    })
  );

  const [problemPayload, setProblemPayload] = useState({
    context: {
      departmentId: localStorage.getItem(`DEPARTMENT_ID`),
    },
    data: {
      resourceType: "Condition",
      text: {
        status: "generated",
        div: "",
      },
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "problem-list-item",
              display: "Problem List Item",
            },
          ],
        },
      ],
      clinicalStatus: {
        coding: [
          {
            code: "active",
            display: "Active",
          },
        ],
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      note: [
        {
          text: "",
        },
      ],
      onsetDateTime: moment
        .tz(
          `${dateObject.getFullYear()}-${
            dateObject.getMonth() <= 8
              ? `0${dateObject.getMonth() + 1}`
              : dateObject.getMonth() + 1
          }-${
            dateObject.getDate() <= 9
              ? `0${dateObject.getDate()}`
              : `${dateObject.getDate()}`
          }T${
            dateObject.getHours() <= 9
              ? `0${dateObject.getHours()}`
              : `${dateObject.getHours()}`
          }:${
            dateObject.getMinutes() <= 9
              ? `0${dateObject.getMinutes()}`
              : `${dateObject.getMinutes()}`
          }:${dateObject.getSeconds()}Z`,
          `YYYY-MM-DDTHH:mm:ss`,
          localStorage.getItem(`DEPARTMENT_TIMEZONE`)
        )
        .utc()
        .format(),
      recordedDate: "2022-09-16T12:27:24Z",
      abatementDateTime: "",
      code: {
        coding: [
          {
            system: "ICD10",
            code: "",
          },
        ],
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [problemIcd10Options, setProblemIcd10Options] = useState<any[]>([]);
  const [selectedIcd10Code, setSelectedIcd10Code] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    problemSynopsis: "",
  });

  const initialiseProblemOptions = async () => {
    try {
      setLoading(true);
      const result = await ReferenceDataService.getProblemData();
      setProblemIcd10Options(result);
    } catch (error) {
      console.error("Error initializing problem options:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProblem = async (problemPayload: any) => {
    try {
      const createdProblem = await ProblemService.createProblem(problemPayload);
      if (localStorage.getItem("XCALIBER_SOURCE") === "ELATION") {
        const createdProblemData = await ProblemService.getProblemById(
          createdProblem?.data?.id
        );
        updateProblems({ resource: { ...createdProblemData } });
      }
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error creating problem:", error);
    }
  };

  const updateProblem = async (problemPayload: any) => {
    try {
      const response = await ProblemService.updateProblem(
        problemId,
        patientId,
        problemPayload
      );
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (mode === "edit" && problemId) {
        try {
          const problemDetails = await ProblemService.getProblemById(
            problemId,
            patientId
          );
          setFormData({
            problemSynopsis: problemDetails?.text?.div || "",
          });
          setSelectedIcd10Code(problemDetails?.code?.coding?.[0]?.code || "");
          setProblemPayload((prevPayload) => ({
            ...prevPayload,
            data: {
              ...prevPayload.data,
              text: {
                status: problemDetails?.text?.status || "generated",
                div: problemDetails?.text?.div || "",
              },
              code: {
                coding: [
                  {
                    system: problemDetails?.code?.coding?.[0]?.system || "",
                    code: problemDetails?.code?.coding?.[0]?.code || "",
                  },
                ],
              },
              note: [
                {
                  text: problemDetails?.note?.[0]?.text || "",
                },
              ],
            },
          }));
        } catch (error) {
          console.error("Error fetching problem details:", error);
        }
      }
    };

    initialiseProblemOptions();
    fetchProblemDetails();
  }, [mode, problemId]);

  const onSubmit = () => {
    const updatedProblemPayload = {
      ...problemPayload,
      data: {
        ...problemPayload.data,
        text: {
          status: "generated",
          div: formData.problemSynopsis,
        },
        code: {
          coding: [
            { system: "http://snomed.info/sct", code: selectedIcd10Code },
          ],
        },
        note: [
          {
            text: formData.problemSynopsis,
          },
        ],
      },
    };

    if (mode === "edit") {
      updateProblem(updatedProblemPayload);
    } else {
      createProblem(updatedProblemPayload);
    }

    setIsDrawerOpen(false);
  };

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        className="mr-12"
        style={{
          border: mode === "edit" ? "none" : "",
          marginTop: mode === "edit" ? "-4px" : "",
          marginLeft: mode === "edit" ? "-16px" : "",
          backgroundColor: mode === "edit" ? "transparent" : "",
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        {mode === "create" ? "+CREATE" : <FaPen className="cursor-pointer" />}
      </Button>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        variant="temporary"
        PaperProps={{
          sx: {
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "10px",
            height: "100%",
            overflowY: "scroll",
            position: "absolute",
            zIndex: 1500,
          },
        }}
      >
        <div className="flex items-center justify-between p-2">
          <Typography variant="h5">
            {mode === "create" ? "Create Problem" : "Edit Problem"}
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <i className="ri-close-line" />
          </IconButton>
        </div>
        <Divider />

        <div style={{ padding: "20px" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Snomed-Code</InputLabel>
            <Select
              value={selectedIcd10Code}
              onChange={(e) => setSelectedIcd10Code(e.target.value)}
              label="Snomed-Code"
            >
              {loading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (problemIcd10Options?.length ?? 0) === 0 ? (
                <MenuItem disabled>No options available</MenuItem>
              ) : (
                problemIcd10Options?.map((option) => (
                  <MenuItem key={option?.SNOMED_CID} value={option?.SNOMED_CID}>
                    {option?.SNOMED_FSN}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Problem Synopsis"
            fullWidth
            type="text"
            value={formData.problemSynopsis || ""}
            onChange={(e) =>
              handleInputChange("problemSynopsis", e.target.value)
            }
            placeholder="Enter Problem Synopsis"
            sx={{ marginBottom: 2 }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
            }}
          >
            <Button
              variant="contained"
              onClick={onSubmit}
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </Box>
        </div>
      </Drawer>
    </>
  );
};
