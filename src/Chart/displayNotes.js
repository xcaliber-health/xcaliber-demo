import {
  Grid,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NoteService } from "../services/P360/noteService";

const DisplayNotes = ({ note, disabled, onCancelClick }) => {
  const [problems, setProblems] = useState([]);
  const [physicalExam, setPhysicalExam] = useState([]);
  const [ros, setROS] = useState([]);
  const [allergyArray, setAllergy] = useState([]);
  const [surgicalArray, setSurgical] = useState([]);
  const [socialArray, setSocial] = useState([]);
  const [pastArray, setPast] = useState([]);
  const [familyArray, setFamily] = useState([]);
  const [habitsArray, setHabit] = useState([]);
  const [medArray, setMed] = useState([]);
  const [assessplanArray, setAssess] = useState([]);
  const [followupArray, setfollowup] = useState([]);

  const [flag, setFlag] = useState(false);
  const commonValueStyles = {
    color: " #84818a",
  };
  useEffect(() => {
    let problemsArray = [];
    let physicalExamArray = [];
    let rosArray = [];
    let pastArray = [];
    let surgicalArray = [];
    let familyArray = [];
    let socialArray = [];
    let habitsArray = [];
    let allergyArray = [];
    let medArray = [];
    let assessplanArray = [];
    let followupArray = [];

    for (let i = 0; i < note?.resource?.content?.length; i++) {
      const noteContent = note?.resource?.content?.[i];

      const { attachment } = noteContent;
      if (!noteContent?.format) {
        if (attachment?.title === "Problem") {
          problemsArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Allergies") {
          allergyArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Past") {
          pastArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Surgical") {
          surgicalArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Family") {
          familyArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Social") {
          socialArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Habits") {
          habitsArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Med") {
          medArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Assessplan") {
          assessplanArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachment?.title === "Followup") {
          followupArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        }
      } else if (noteContent?.format?.display?.toLowerCase() === "pe") {
        physicalExamArray.push({
          data: attachment?.data,
          title: attachment?.title,
        });
      } else if (noteContent?.format?.display?.toLowerCase() === "ros") {
        rosArray.push({
          data: attachment?.data,
          title: attachment?.title,
        });
      }
    }
    setProblems(problemsArray);
    setPhysicalExam(physicalExamArray);
    setROS(rosArray);
    setPast(pastArray);
    setSurgical(surgicalArray);
    setFamily(familyArray);
    setSocial(socialArray);
    setHabit(habitsArray);
    setAllergy(allergyArray);
    setMed(medArray);
    setAssess(assessplanArray);
    setfollowup(followupArray);

    setFlag(true);
  }, []);
  const onSaveNote = async () => {
    const noteId = await NoteService.createNote({
      data: { ...note.resource },
    });
    console.log(noteId);
  };
  if (flag) {
    return (
      <Grid container>
        <Grid item pt={2} sx={{ width: "100%" }}>
          <Grid item pt={2}>
            <Typography variant="h4">{`Notes`}</Typography>
          </Grid>
          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Problems</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {problems &&
                    problems?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel3a-header"
              >
                <Typography>Physical Exam</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {physicalExam &&
                    physicalExam?.map((peItem) => {
                      return (
                        peItem?.data !== "" && (
                          <Grid item>
                            <Typography> {peItem?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {peItem?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel4a-header"
              >
                <Typography>ROS</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {ros &&
                    ros?.map((rosItem) => {
                      return (
                        rosItem?.data !== "" && (
                          <Grid item>
                            <Typography> {rosItem?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {rosItem?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Allergies</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {allergyArray &&
                    allergyArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Past History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {pastArray &&
                    pastArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Surgical History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {surgicalArray &&
                    surgicalArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Family History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {familyArray &&
                    familyArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Social History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {socialArray &&
                    socialArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Habits</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {habitsArray &&
                    habitsArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Medications</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {medArray &&
                    medArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Assessment Plan</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {assessplanArray &&
                    assessplanArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid sx={{ width: "100%" }} item pt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Follow up</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column">
                  {followupArray &&
                    followupArray?.map((item) => {
                      return (
                        item?.data !== "" && (
                          <Grid item>
                            <Typography> {item?.title}</Typography>

                            <Typography pb={1} sx={{ ...commonValueStyles }}>
                              {item?.data}
                            </Typography>
                          </Grid>
                        )
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {!disabled && (
            <Grid
              container
              item
              style={{
                display: "flex",
                flexDirection: "row",
                width: "60%",
                paddingTop: 12,
              }}
              justifyContent={"space-between"}
            >
              <Button
                onClick={() => {
                  onSaveNote();
                  onCancelClick();
                }}
                variant="contained"
              >
                Sign
              </Button>
              <Button
                onClick={() => {
                  onCancelClick();
                }}
                variant="contained"
              >
                Save As Draft
              </Button>
              <Button onClick={onCancelClick} variant="contained">
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
};
export default DisplayNotes;
