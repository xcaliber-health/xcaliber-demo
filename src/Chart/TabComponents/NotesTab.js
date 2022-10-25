import { Grid, Paper, Button, Drawer } from "@mui/material";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { NoteService } from "../../services/P360/noteService";
import CreateNotes from "../CreateNotes";

const NotesTab = ({ patientId }) => {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getNotes = async () => {
    const result = await NoteService.getVisitNotes(patientId);
    setNotes(result);
  };

  useEffect(() => {
    Promise.all([getNotes()]);
  }, []);
  return (
    <Grid container spacing={2} direction={"column"}>
      <Button
        onClick={() => {
          setIsDrawerOpen(true);
        }}
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
        <CreateNotes />
      </Drawer>
      <Paper style={{ marginTop: theme.spacing(4), overflow: "scroll" }}>
        {notes}
      </Paper>
    </Grid>
  );
};

export default NotesTab;
