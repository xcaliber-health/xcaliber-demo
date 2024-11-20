import {
  Grid,
  Paper,
  Button,
  Drawer,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { NoteService } from "../../services/P360/noteService";
import CreateNotes from "../CreateNotes";
import { Helper } from "../../core-utils/helper";
import DisplayNotes from "../displayNotes";
import DraftNotes from "../draftNotes";
import NotesBlock from "./HelperComponent";
import Loading from "../../Patient/Loading";

const NotesTab = ({ patientDetails, bookedNote }) => {
  const theme = useTheme();
  const [notes, setNotes] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNoteDisplayDrawerOpen, setIsNoteDisplayDrawerOpen] = useState(false);
  const [isUnsignedNoteDisplayDrawerOpen, setIsUnsignedNoteDisplayDrawerOpen] =
    useState(false);
  const [note, setNote] = useState({});
  const [flag, setFlag] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [currentDraftNoteIndex, setCurrentDraftNoteIndex] = useState(null);
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
  const [notesPayload, setNotesPayload] = useState({
    data: {
      resourceType: "DocumentReference",
      status: "current",
      subject: {
        reference: `Patient/${patientDetails?.id}`,
      },
      category: [
        {
          coding: [
            {
              system: "https://sandbox.elationemr.com/api/2.0/visit_note_types",
              code: "Elation",
              display: "Simple",
            },
          ],
        },
      ],
      docStatus: "preliminary",
      date: "",
      extension: [
        {
          url: "http://xcaliber-fhir/structureDefinition/practice",
          valueString: 140857911017476,
        },
        {
          url: "http://xcaliber-fhir/structureDefinition/created-date",
          valueString: "2022-09-17T07:32:16Z",
        },
      ],
      context: {
        encounter: [
          {
            reference: "Encounter/2022-09-17T07:32:16Z",
          },
        ],
        period: {
          start: "2022-09-17T07:32:16Z",
        },
      },
      author: [
        {
          reference: "Practitioner/140857915539458",
          identifier: {
            id: "user_id",
            value: 2758,
          },
        },
      ],
    },
  });

  const getNotes = async (patientId) => {
    const result = await NoteService.getVisitNotes(patientId);
    setNotes(result);
  };

  const updateNotes = (createdNote) => {
    setNotes([createdNote, ...notes]);
  };

  // patientDetails,
  // noteFormDetails,
  const onCreateClick = async (notesPayload) => {
    const noteResponse = await NoteService.createNote(notesPayload);
    const createdNote = await NoteService.getVisitNoteById(noteResponse);
    setNotes([...notes, { resource: { ...createdNote } }]);
    setIsDrawerOpen(false);
  };

  const onCancelClick = () => {
    setIsDrawerOpen(false);
  };
  const ondisplayNoteCancelClick = () => {
    setIsNoteDisplayDrawerOpen(false);
  };
  const onDateChange = (date) => {
    setNotesPayload({
      data: {
        ...notesPayload?.data,
        date: date,
      },
    });
  };
  const onTimeChange = (time) => {
    let finalDateValue = notesPayload?.data?.date?.slice(0, 10);
    setNotesPayload({
      data: {
        ...notesPayload?.data,
        start: `${finalDateValue}${time}`,
      },
    });
  };
  const onTemplateChange = (templateValue) => {
    setNotesPayload({
      data: {
        ...notesPayload?.data,
        category: [
          {
            coding: [
              {
                system:
                  "https://sandbox.elationemr.com/api/2.0/visit_note_types",
                code: "Elation",
                display: templateValue,
              },
            ],
          },
        ],
        subject: {
          reference: `Patient/${patientDetails?.id}`
        }
      },
    });
  };
  const updatePatientId = (patientId) => {
    setNotesPayload({
      data: {
        ...notesPayload?.data,
        subject: {
          reference: `Patient/${patientId}`,
        },
      },
    });
  };

  return (
    <Grid container spacing={1} direction={"column"}>
      <Button
        onClick={() => {
          setIsDrawerOpen(true);
        }}
        sx={{ display: "flex", alignSelf: "flex-end" }}
        variant="contained"
      >
        Create Note
      </Button>
      <Drawer
        anchor={"right"}
        open={isDrawerOpen}
        variant="temporary"
        onClose={() => {
          setIsDrawerOpen(false);
        }}
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
        <CreateNotes
          noteFormDetails={notesPayload}
          onCancelClick={onCancelClick}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          onCreateClick={onCreateClick}
          onTemplateChange={onTemplateChange}
          updatePatientId={updatePatientId}
          patientDetails={patientDetails}
          reloadNotes={updateNotes}
          bookedNote={bookedNote}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isNoteDisplayDrawerOpen}
        variant="temporary"
        onClose={() => {
          setIsNoteDisplayDrawerOpen(false);
        }}
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
        <DisplayNotes
          note={note}
          disabled={disabled}
          onCancelClick={ondisplayNoteCancelClick}
          reloadNotes={getNotes}
          patientDetails={patientDetails}
        />
      </Drawer>
      <Drawer
        anchor={"right"}
        open={isUnsignedNoteDisplayDrawerOpen}
        variant="temporary"
        onClose={() => {
          setIsUnsignedNoteDisplayDrawerOpen(false);
        }}
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
        <DraftNotes
          currentDraftNoteIndex={currentDraftNoteIndex}
          patientDetails={patientDetails}
          note={note}
          onCancelClick={() => {
            setIsUnsignedNoteDisplayDrawerOpen(false);
          }}
          reloadNotes={getNotes}
        />
      </Drawer>
      {flag && (
        <Grid container direction="column">
          <Paper style={{ marginTop: theme.spacing(2) }}>
            <Typography pt={1} sx={{ paddingLeft: "15px", fontWeight: "bold" }}>
              Unsigned Notes
            </Typography>

            {localStorage.getItem(`notes_${patientDetails?.id}`) &&
              JSON.parse(
                localStorage.getItem(`notes_${patientDetails?.id}`)
              )?.map((note, index) => {
                return (
                  <ListItemButton
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                    divider
                    key={note.id}
                    onClick={() => {
                      setCurrentDraftNoteIndex(index);
                      setIsUnsignedNoteDisplayDrawerOpen(true);
                      setDisabled(false);
                      setNote(note);
                    }}
                  >
                    <ListItemText primary={note?.resource?.description} />
                    <ListItemText secondary={note?.resource?.docStatus} />
                    <ListItemText>
                      <span style={{ color: "black" }}>
                        {
                          Helper.extractFieldsFromDate(
                            note?.resource?.date?.slice(0, 10)
                          )?.DAY
                        }
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {
                          Helper.extractFieldsFromDate(
                            note?.resource?.date?.slice(0, 10)
                          )?.MONTH
                        }
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {
                          Helper.extractFieldsFromDate(
                            note?.resource?.date?.slice(0, 10)
                          )?.DATE
                        }
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {
                          Helper.extractFieldsFromDate(
                            note?.resource?.date?.slice(0, 10)
                          )?.YEAR
                        }
                      </span>
                    </ListItemText>
                  </ListItemButton>
                );
              })}
          </Paper>
          <Paper style={{ marginTop: theme.spacing(2) }}>
            <Typography pt={1} sx={{ paddingLeft: "15px", fontWeight: "bold" }}>
              Signed Notes
            </Typography>

            {notes &&
              notes?.map((note) => {
                let noteDateValue =
                  localStorage.getItem("XCALIBER_SOURCE") === "ELATION" ||
                    localStorage.getItem("XCALIBER_SOURCE") === "EPIC"
                    ? note?.resource?.date
                    : note?.resource?.context?.period?.start;
                return (
                  <ListItemButton
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                    divider
                    key={note.id}
                    onClick={() => {
                      setIsNoteDisplayDrawerOpen(true);
                      setDisabled(true);
                      setNote(note);
                    }}
                  >
                    <ListItemText
                      primary={
                        note.resource?.content?.map((item) => {
                          let plainText = "";
                          try {
                            plainText = atob(item?.attachment?.data, "base64");
                          }
                          catch (e) {
                            console.log(e);
                          }
                          return <NotesBlock
                            plainText={plainText}>
                          </NotesBlock>
                        })
                      }
                    />

                    {/* <ListItemText secondary={note?.resource?.docStatus} />
                    <ListItemText>
                      <span style={{ color: "black" }}>
                        {Helper.extractFieldsFromDate(noteDateValue)?.DAY}
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {Helper.extractFieldsFromDate(noteDateValue)?.MONTH}
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {Helper.extractFieldsFromDate(noteDateValue)?.DATE}
                      </span>{" "}
                      <span style={{ color: "black" }}>
                        {Helper.extractFieldsFromDate(noteDateValue)?.YEAR}
                      </span>
                    </ListItemText> */}
                  </ListItemButton>
                );
              })}
          </Paper>
        </Grid>
      )}
      {!flag && <Loading />}
    </Grid>
  );
};

export default NotesTab;
