import { ThemeProvider, CssBaseline, Container, Typography, Box, Grid } from '@mui/material';
import { theme } from './theme';
import { DocumentList } from './components/DocumentList';
import { QueryBox } from './components/QueryBox';
import { useTranslation } from 'react-i18next';
import './i18n';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Container maxWidth="lg">
          <Box className="app-header">
            <Typography variant="h4" component="h1" className="app-title">
              {t('app.title')}
            </Typography>
            <Typography variant="body1" className="app-subtitle">
              {t('app.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <DocumentList />
            </Grid>
            <Grid item xs={12} md={6}>
              <QueryBox />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
