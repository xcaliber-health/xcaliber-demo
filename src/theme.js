import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#185DA0',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    text : {
      
    }
  },
  typography:{
    fontFamily : "Montesteratt"
  }
});

export default theme;
