import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { amber } from '@mui/material/colors';

// Custom styled components
const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: amber[500], // Customize the background color
    padding: '16px',
    position: 'fixed',
    top: '16px',
    right: '16px',
  },
});

const StyledDialogContent = styled(DialogContent)({
  '&:hover': {
    cursor: 'pointer',
  },
});

const StyledTypography = styled(Typography)({
  color: 'white', // Customize the text color
});

const Popup = ({ data, onClose }) => {
  const handleClick = () => {
    const id = `${data.event.patientId}`;
    window.location.href = `/p360/${id}`; // Use window.location.href to navigate
    onClose(); // Close the popup
  };

  const eventData = data && data.event;

  return (
    <StyledDialog
      open={Boolean(data)}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      BackdropProps={{}}
    >
      <StyledDialogContent onClick={handleClick}>
        <StyledTypography variant="body1">{`New ${data?.event?.resource?.resourceType} Created`}</StyledTypography>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default Popup;