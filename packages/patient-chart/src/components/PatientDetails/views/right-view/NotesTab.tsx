import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Notes from "./notes/Notes";
import NotesModal from "./notes/NotesModal";
import { fetchNotes } from "../right-view/notes/utils/getNotes";

const NotesTab = ({ patientId }: { patientId: string }) => {
  const [notesData, setNotesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedNoteDetails, setSelectedNoteDetails] = useState<any>(null);

  const handleOpenModal = (note: any) => {
    setSelectedNoteDetails({
      date: note.date || "Unknown Date",
      tags: [
        {
          text: "Note",
          color: "#e3f2fd",
          textColor: "#1976d2",
        },
      ],
      sections: note.content.map((item: any) => ({
        content: item?.attachment?.data || "No Content Available",
      })),
    });
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
        console.log("Fetched notes:", notes); // Logging raw notes data
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
  
  

  const renderShimmer = () => (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Accordion
          key={index}
          style={{
            borderRadius: "8px",
            marginBottom: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
          defaultExpanded={index === 0}
          disabled
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            style={{
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "16px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  width: "25%",
                }}
              ></div>
              <div
                style={{
                  height: "16px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "4px",
                  width: "10%",
                }}
              ></div>
            </div>
          </AccordionSummary>
          <AccordionDetails
            style={{
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                height: "16px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                width: "50%",
                marginBottom: "8px",
              }}
            ></div>
            <div
              style={{
                height: "16px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                width: "100%",
                marginBottom: "8px",
              }}
            ></div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );

  if (loading) {
    return renderShimmer();
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (notesData.length === 0) {
    return <Typography>No notes available for this patient.</Typography>;
  }

  return (
    <div style={{ margin: "16px 0" }}>
      {notesData.map((note, index) => (
        <Accordion
          key={index}
          style={{
            borderRadius: "8px",
            marginBottom: "16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
          defaultExpanded={index === 0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`panel-header-${index + 1}`}
            aria-controls={`panel-content-${index + 1}`}
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
              {note.date || "Unknown Date"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            onClick={() => handleOpenModal(note)}
            style={{ backgroundColor: "#fff",cursor: "pointer" }}
          >
            <Notes
              note={{
                date: note.date || "Unknown Date",
                tags: [
                  {
                    text: "Note",
                    color: "#e3f2fd",
                    textColor: "#1976d2",
                  },
                ],
                sections: note.content.map((item: any) => ({
                  content: `${item?.attachment?.title}: ${item?.attachment?.data || "No Content Available"}`,
                })),
              }}
            />
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
      ))}

      {selectedNoteDetails && (
        <NotesModal
          open={openModal}
          onClose={handleCloseModal}
          note={selectedNoteDetails}
        />
      )}
    </div>
  );
};

export default NotesTab;

