import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.colors.primary.main,
      contrastText: tokens.colors.primary.contrastText,
    },
    background: {
      default: tokens.colors.dark.bg,
      paper: tokens.colors.dark.surface,
    },
    text: {
      primary: tokens.colors.text.primary,
      secondary: tokens.colors.text.secondary,
    },
    success: {
      main: tokens.colors.status.sent.main,
    },
    warning: {
      main: tokens.colors.status.warning.main,
    },
    error: {
      main: tokens.colors.status.error.main,
    },
    divider: tokens.colors.dark.border,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: tokens.colors.primary.main,
          color: tokens.colors.primary.contrastText,
          '&:hover': {
            backgroundColor: tokens.colors.primary.hover,
          },
        },
        outlined: {
          borderColor: tokens.colors.dark.borderLight,
          color: tokens.colors.text.primary,
          '&:hover': {
            borderColor: tokens.colors.primary.main,
            backgroundColor: tokens.colors.primary.subtle,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(5, 7, 7, 0.6)',
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.dark.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.dark.borderLight,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.primary.main,
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: tokens.colors.dark.surface,
          borderColor: tokens.colors.dark.border,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.colors.dark.elevated,
          border: `1px solid ${tokens.colors.dark.border}`,
          borderRadius: 12,
        },
      },
    },
  },
});
