import { useState } from 'react';

// import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import { Button, Typography } from '@mui/material';
// import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'Athena',
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    value: 'de',
    label: 'Elation',
    icon: '/assets/icons/ic_flag_de.svg',
  },
  {
    value: 'fr',
    label: 'Canvas',
    icon: '/assets/icons/ic_flag_fr.svg',
  },
  {
    value: 'fr',
    label: 'Epic',
    icon: '/assets/icons/ic_flag_fr.svg',
  },
  {
    value: 'fr',
    label: 'eCW',
    icon: '/assets/icons/ic_flag_fr.svg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        {/* <img src={LANGS[0].icon} alt={LANGS[0].label} /> */}
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          EHR system
        </Typography>
      </Button>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === LANGS[0].value}
            onClick={() => handleClose()}
            sx={{ typography: 'body2', py: 1 }}
          >
            {/* <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} /> */}

            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
