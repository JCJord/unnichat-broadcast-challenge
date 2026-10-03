import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

const { colors } = tokens;

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary.DEFAULT,
      contrastText: colors.primary.contrast,
    },
    background: {
      default: colors.dark.bg,
      paper: colors.dark.surface,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    success: {
      main: colors.status.sent,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    divider: colors.dark.border,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: tokens.fontFamily.join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.dark.bg,
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.dark.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.dark['border-light'],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.DEFAULT,
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.dark.surface,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.dark.elevated,
          border: `1px solid ${colors.dark.border}`,
          borderRadius: 16,
        },
      },
    },
  },
});
