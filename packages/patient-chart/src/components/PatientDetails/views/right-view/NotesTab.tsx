import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Notes from "./notes/Notes";
import NotesModal from "./notes/NotesModal";
import { fetchNotes, TransformedNote } from "../right-view/notes/utils/getNotes";

const NotesTab = ({ patientId }: { patientId: string }) => {
  const [notesData, setNotesData] = useState<TransformedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedNoteDetails, setSelectedNoteDetails] = useState<any>(null);

  const handleOpenModal = (note: TransformedNote) => {
    const transformedNote = transformToNoteDetails(note); 
    setSelectedNoteDetails(transformedNote);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNoteDetails(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notes = await fetchNotes(patientId);
        console.log("Fetched notes:", notes);
        setNotesData(notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  if (loading) {
    return <Typography>Loading notes...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (notesData.length === 0) {
    return <Typography>No notes available for this patient.</Typography>;
  }

  const transformToNoteDetails = (note: TransformedNote) => {
    return {
      date: note.date,
      title: "Patient Note",
      tags: [
        {
          text: "Note",
          color: "#e3f2fd",
          textColor: "#1976d2",
        },
      ],
      sections: [
        {
          heading: "Details",
          content: note.plainTextContent,
        },
      ],
    };
  };

  return (
    <div style={{ margin: "16px 0" }}>
      {notesData.map((note, index) => {
        const noteDetails = transformToNoteDetails(note);
        return (
          <Accordion
            key={index}
            style={{
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "16px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            defaultExpanded={index === 0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`panel-header-${index + 1}`}
              aria-controls={`panel-content-${index + 1}`}
              style={{
                backgroundColor: "#f9f9f9",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
                {note.date || "Unknown Date"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ backgroundColor: "#f9f9f9" }}>
              <Notes note={noteDetails} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                  gap: "12px",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenModal(note)}
                >
                  Open
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <NotesModal open={openModal} onClose={handleCloseModal} note={selectedNoteDetails} />
    </div>
  );
};

export default NotesTab;
