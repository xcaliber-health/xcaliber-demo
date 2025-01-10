import { Modal, Box, Typography, IconButton } from "@mui/material"; 
import { FiEdit, FiX } from "react-icons/fi";
import Notes from "./Notes";

const NotesModal = ({ open, onClose, note }:any) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        {note && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {note.title}
              </Typography>
              <IconButton onClick={onClose}>
                <FiX size={24} />
              </IconButton>
            </div>

            <Notes note={note} />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <FiEdit /> Edit
              </button>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default NotesModal;
