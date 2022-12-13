import { Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { NoteService } from "../../services/P360/noteService";
import { Helper } from "../../core-utils/helper";
import Loading from "../../Patient/Loading";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const TimeLine = ({ patientDetails }) => {
  const theme = useTheme();
  const [notes, setNotes] = useState();
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(`notes_${patientDetails?.id}`)) {
      localStorage.setItem(`notes_${patientDetails?.id}`, JSON.stringify([]));
    }
  }, []);
  useEffect(() => {
    Promise.all([getNotes(patientDetails?.id)]);
  }, [patientDetails]);

  useEffect(() => {
    if (notes && notes !== null && notes?.length >= 0) {
      setFlag(true);
    }
  }, [notes]);

  const getNotes = async (patientId) => {
    const result = await NoteService.getNotesForTimeLine(patientId);
    setNotes(result);
  };

  return (
    <Grid container spacing={1} direction={"column"}>
      {flag && (
        <Grid container direction="column">
          <Paper style={{ marginTop: theme.spacing(2) }}>
            {notes &&
              notes?.map((note) => {
                let noteDateValue = note?.date;

                let provider = note?.provider;
                let diagnosis = note?.diagnosis;
                let summary = note?.summary;
                return (
                  <TimelineItem>
                    <TimelineOppositeContent color="textSecondary">
                      {Helper.extractFieldsFromDate(noteDateValue)?.MONTH +
                        " " +
                        Helper.extractFieldsFromDate(noteDateValue)?.DATE +
                        " , " +
                        Helper.extractFieldsFromDate(noteDateValue)?.YEAR}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <strong>{diagnosis}</strong>
                      <br />
                      <strong style={{ color: "gray" }}>
                        {provider}
                      </strong>
                      <div>{summary}</div>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            {notes.length == 1 ? (
              <div style={{textAlign:'center',direction:'column',marginLeft:'49.5%'}}>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
              </div>
            ) : (
              <></>
            )}
          </Paper>
        </Grid>
      )}
      {!flag && <Loading />}
    </Grid>
  );
};

export default TimeLine;
