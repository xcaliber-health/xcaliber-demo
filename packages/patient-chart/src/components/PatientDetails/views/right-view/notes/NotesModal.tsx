import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Modal, Box, Typography, Chip, Button, TextField } from "@mui/material";
import { NoteService } from "../../../../../services/noteService"; 


interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  note: {
    id?: string; // Note ID for updates
    sections?: { content: string }[];
    date?: string;
    tags?: { text: string; color: string; textColor: string }[];
  } | null;
}

const NotesModal = ({ open, onClose, note }: NotesModalProps) => {
  const [isElation, setIsElation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSections, setEditedSections] = useState<{ title: string; content: string }[]>([]);

  useEffect(() => {
    const systemType = localStorage.getItem("XCALIBER_SOURCE") || "ATHENA";
    setIsElation(systemType === "ELATION");

    if (note?.sections) {
      const formattedSections = note.sections.map((section) => {
        const match = section.content.match(/^(.*?):\s*(.*)$/);
        return {
          title: match ? match[1] : "",
          content: match ? match[2] : section.content,
        };
      });
      setEditedSections(formattedSections);
    }
  }, [note]);

  const handleEditClick = () => {
    setEditMode(true);
    console.log("Edit mode activated.");
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    console.log("Edit mode canceled.");
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedSections = [...editedSections];
    updatedSections[index].content = value;
    setEditedSections(updatedSections);
  };

  const handleSaveEdit = async () => {
    if (!note?.id) {
      console.error("❌ No note ID found, cannot update.");
      return;
    }
  
    const updatedNotePayload = {
      data: {
        content: editedSections.map((section) => ({
          attachment: {
            title: section.title,
            data: section.content,
          },
        })),
      },
    };
  
    console.log("📌 Checking function:", NoteService.createOrUpdateNote); 
    console.log("📌 Sending update request for Note ID:", note.id);
    console.log("📤 Payload:", JSON.stringify(updatedNotePayload, null, 2));
  
    try {
      const response = await NoteService.createOrUpdateNote(updatedNotePayload, note.id,"0");
      console.log("✅ Note updated successfully:", response);
  
      setEditMode(false);
      onClose();
    } catch (error) {
      console.error("❌ Error updating note:", error);
    }
  };
  
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {note?.date || "Unknown Date"}
          </Typography>
          <div style={{ display: "flex", gap: "8px" }}>
            {(note?.tags || []).map(({ text, color, textColor }, index) => (
              <Chip
                key={index}
                label={text}
                style={{
                  backgroundColor: color,
                  color: textColor,
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderRadius: "16px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content Section */}
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#333",
            padding: "24px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            width: "100%",
          }}
        >
          {editMode ? (
            editedSections.map((section, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                {/* Title (Read-only) */}
                <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "6px" }}>
                  {section.title}:
                </div>
                {/* Editable Content */}
                <TextField
                  variant="outlined"
                  multiline
                  fullWidth
                  rows={4}
                  value={section.content}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            ))
          ) : isElation ? (
            note?.sections?.length ? (
              note.sections.map((section, index) => {
                const match = section.content.match(/^(.*?):\s*(.*)$/);
                const title = match ? match[1] : "";
                const data = match ? match[2] : section.content;

                return (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    {/* Title */}
                    {title && (
                      <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "6px" }}>
                        {title}:
                      </div>
                    )}
                    {/* Data */}
                    <div style={{ fontSize: "16px", color: "#555", paddingLeft: "8px" }}>
                      {data}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No content available.</p>
            )
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  note?.sections?.map((section) => section.content).join("<br /><br />") || ""
                ),
              }}
            ></div>
          )}
        </div>

        {/* Buttons Section */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
          {editMode ? (
            <>
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditClick}
              style={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Edit
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default NotesModal;
