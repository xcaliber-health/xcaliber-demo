import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FiExternalLink } from "react-icons/fi";
import NotesModal from "./notes/NotesModal";
import Notes from "./notes/Notes";

const NotesTab = () => {
  const notesData = [
    {
      date: "December 30, 2024",
      title: "Physical Exam",
      tags: [
        { text: "Nurse: Francis Byrd", color: "#ffe5e5", textColor: "#e53935" },
        { text: "Elation", color: "#2e8ada", textColor: "white" },
      ],
      sections: [
        {
          heading: "Patient Information",
          content: [
            "Patient: Sean Hallam",
            "DOB: 01/15/1980",
            "Date: 12/30/2024 Time: 14:30",
            "Reason for Visit: Routine check-up",
          ],
        },
        {
          heading: "Vitals",
          content: [
            "BP: 120/80 mmHg",
            "HR: 72 bpm, regular",
            "RR: 18 breaths/min",
            "Temp: 98.6°F (oral)",
            "O2 Sat: 99% on room air",
            "Height: 5'10\"",
            "Weight: 175 lbs",
            "BMI: 25.1",
          ],
        },
        {
          heading: "General Appearance",
          content: [
            "Patient is alert, oriented, and in no acute distress. Appears well-nourished and well-groomed.",
          ],
        },
        {
          heading: "Plan",
          content: [
            "Continue with preventative health measures. Recommend annual physical exams. Discussed diet and exercise.",
          ],
        },
      ],
    },
    {
      date: "October 27, 2024",
      title: "Care Plan",
      tags: [
        { text: "Ophthalmologist: Eugenia Parsons", color: "#fde4e4", textColor: "#e53935" },
        { text: "Epic", color: "#ff0000", textColor: "white" },
      ],
      sections: [
        {
          heading: "Eye Care",
          content: [
            "Needs: Ensure regular checkups are scheduled and attended.",
            "Interventions: Remind of, schedule, and provide transportation to appointments.",
          ],
        },
      ],
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleOpenModal = (note:any) => {
    setSelectedNote(note);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNote(null);
  };

  return (
    <div style={{ margin: "16px 0" }}>
      {notesData.map((note, index) => (
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
              {note.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ backgroundColor: "#f9f9f9" }}>
            <Notes note={note} />
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
                <FiExternalLink /> Open
              </button>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

      <NotesModal
        open={openModal}
        onClose={handleCloseModal}
        note={selectedNote}
      />
    </div>
  );
};

export default NotesTab;
