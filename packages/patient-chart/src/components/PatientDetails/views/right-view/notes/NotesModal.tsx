import DOMPurify from "dompurify";
import { Modal, Box, Typography, Chip } from "@mui/material";

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  note: {
    sections?: { content: string }[];
    date?: string;
    tags?: { text: string; color: string; textColor: string }[];
  } | null;
}

const NotesModal = ({ open, onClose, note }: NotesModalProps) => {
  const dummyTags = [
    { text: "Urgent", color: "#ffebee", textColor: "#d32f2f" },
    { text: "Follow-Up", color: "#e3f2fd", textColor: "#1976d2" },
  ];

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
            {(note?.tags || dummyTags).map(({ text, color, textColor }, index) => (
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
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              note?.sections?.map((section) => section.content).join("") || ""
            ),
          }}
        ></div>
      </Box>
    </Modal>
  );
};

export default NotesModal;
