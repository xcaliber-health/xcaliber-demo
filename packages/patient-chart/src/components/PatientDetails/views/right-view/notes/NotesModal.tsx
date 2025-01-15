import { Modal, Box, Typography, IconButton } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import Notes from "./Notes";

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  note: any;
}

const NotesModal = ({ open, onClose, note }: NotesModalProps) => {
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
              <IconButton>
                <FiEdit size={24} />
              </IconButton>
            </div>

            <Notes note={note} />
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default NotesModal;
