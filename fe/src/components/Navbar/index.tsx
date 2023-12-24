import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ScheduleIcon from '@mui/icons-material/Schedule';

const items = [
  {
    label: 'Todo App',
  },
];

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-evenly' }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1">{item.label}</Typography>
          </div>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
