import { ThemeProvider, CssBaseline } from '@mui/material';
import { muiTheme } from './theme/muiTheme';

export function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-dark-bg text-text-primary" />
    </ThemeProvider>
  );
}

export default App;
