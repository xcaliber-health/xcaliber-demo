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

const DisplayNotes = ({ note }) => {
  const [problems, setProblems] = useState([]);
  const [physicalExam, setPhysicalExam] = useState([]);
  const [ros, setROS] = useState([]);

  const [flag, setFlag] = useState(false);
  const commonValueStyles = {
    color: " #84818a",
  };
  useEffect(() => {
    let problemsArray = [];
    let physicalExamArray = [];
    let rosArray = [];
    let allergyArray = [];
    for (let i = 0; i < note?.resource?.content?.length; i++) {
      const noteContent = note?.resource?.content?.[i];

      const { attachment } = noteContent;
      if (!noteContent?.format) {
        if (attachement?.title === "Problem") {
          problemsArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachement?.title === "Allergies") {
          allergyArray.push({
            data: attachment?.data,
            title: attachment?.title,
          });
        } else if (attachement?.title === "Past") {
          allergyArray.push({
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
    setFlag(true);
  }, []);
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
        </Grid>
      </Grid>
    );
  }
};
export default DisplayNotes;
