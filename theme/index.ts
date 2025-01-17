import {createTheme} from '@mui/material/styles';
import { lighten } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#34C759',
      main: '#018981',
      dark: '#00615a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#B12341',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1152,
      lg: 1336,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(84.61deg, #018981 3.58%, #01AE6B 48.75%, #9CE04E 95.77%)',
          color: '#fff',
          '&:hover': {
            background: `linear-gradient(84.61deg, 
              ${lighten('#018981', 0.2)} 3.58%, 
              ${lighten('#01AE6B', 0.2)} 48.75%, 
              ${lighten('#9CE04E', 0.2)} 95.77%)`,
               
            },
          },
        },
      },
    },
  
});

export default theme;
