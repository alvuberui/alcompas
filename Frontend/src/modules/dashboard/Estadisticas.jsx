
import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useEstadisticasStore } from '../../hooks';
import { Estadistica } from '../../Components';


export const Estadisticas = () => {

    const [value, setValue] = useState(0);
    const [populares, setPopulares] = useState([]);
    const [contratosSemanaSanta, setContratosSemanaSanta] = useState([]);
    const [contratos, setContratos] = useState([]);

    const handleChange = (event, newValue) => {
        event.preventDefault();
        setValue(newValue);
    };

    const { getBandasConMasContratos, getBandasConMasContratosSemanaSanta, getBandasPopulares } = useEstadisticasStore();

    useEffect(() => {
        const getPopulares = async () => {
            const response = await getBandasPopulares();
            setPopulares(response);
        }
        const getContratosSemanaSanta = async () => {
            const response = await getBandasConMasContratosSemanaSanta();
            setContratosSemanaSanta(response);
        }
        const getContratos = async () => {
            const response = await getBandasConMasContratos();
            setContratos(response);
        }
        getPopulares();
        getContratos();
        getContratosSemanaSanta();
    }, []);

  return (
    <Grid
    container
    sx = {{ mt: 5 }}
    displey="flex"
    justifyContent="center"
    alignItems="center">

        <Typography sx={{ fontWeight: 'bold' }} variant='h4'>Estadísticas Globales</Typography>
        <Box  xs={12}   sx={{ width: '95%', color:'white',display:"flex", justifyContent: 'space-evenly', flexDirection:'column', backgroundColor:'#262254', borderRadius:'5px' }}>
            <Tabs value={value} onChange={handleChange} textColor='inherit' centered sx={{
                '& .MuiTabs-flexContainer': {
                flexWrap: 'wrap',
            }
            }}>
                <Tab  label="Más populares" />
                <Tab aria-label='click1' label="Con más contratos en semana santa" />
                <Tab aria-label='click2' label="Con más contratos" />
            </Tabs>
        </Box>
        <Box sx={{ width: '95%', color:'white',display:"flex", justifyContent: 'space-evenly', flexDirection:'column', borderRadius:'5px' }}>
            
            { value === 0 && populares.map((banda, index) =>
                <Estadistica 
                { ...banda }
                key={index}
                banda={banda}
                tipo='popular'
                />
            )}
            { value === 1 && contratosSemanaSanta.map((banda, index) =>
                <Estadistica 
                { ...banda }
                key={index}
                banda={banda}
                tipo='semana santa'
                />
            )}
            { value === 2 && contratos.map((banda, index) =>
                <Estadistica 
                { ...banda }
                key={index}
                banda={banda}
                tipo='contratos'
                />
            )}
        </Box>
    </Grid>
  )
}
