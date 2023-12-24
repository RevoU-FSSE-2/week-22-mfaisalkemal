import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../../components';
import { CssBaseline, Container, Paper } from '@mui/material';

const PublicLayout = () => {
  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Container style={{ flex: 1 }}>
        <Paper elevation={3} style={{ marginTop: '32px'}}>
          <Outlet />
        </Paper>
      </Container>
    </div>
  );
};

export default PublicLayout;
