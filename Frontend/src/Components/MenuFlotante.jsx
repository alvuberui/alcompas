import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export  function MenuFlotante() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '95%', color:'white', backgroundColor:'#262254', borderRadius:'5px' }}>
      <Tabs value={value} onChange={handleChange} textColor='inherit' centered>
        <Tab label="Experiencias" />
        <Tab label="Instrumentos" />
        <Tab label="Estudios" />
      </Tabs>
    </Box>
  );
}
