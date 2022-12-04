
import { Grid, Typography, Button, Box } from '@mui/material';
import { useBandasStore, useDirectivosStore, useAuthStore, usePeticionesStore } from '../hooks';
import { useState, useEffect } from 'react';

export const Peticion = ({ _id, estado, instrumento, mensaje, rol, voz, cargo, banda, usuario,  directivo, fecha }) => {
    // Estados
    const [ banda_nombre, setBanda ] = useState([]);
    const [ directivo_nombre, setDirectivo_nombre ] = useState([]);
    

    // Funciones
    const { getBandaById } = useBandasStore();
    const { getDirectivoById } = useDirectivosStore();
    const { getUserByiD } = useAuthStore();
    const { aceptarPeticion, rechazarPeticion } = usePeticionesStore();

    const handleButtonAceptar = (event)  => {
        event.preventDefault();
        aceptarPeticion(_id);
        window.location.reload(false);
    };

    const handleButtonRechazar = (event)  => {  
        event.preventDefault();
        rechazarPeticion(_id);
        window.location.reload(false);
    };

    // Efectos
    useEffect(() => {
        const getBanda = async () => {
            const bandareq = await getBandaById(banda);
            setBanda(bandareq);  
        }
        const getDirectivo = async () => {
            const directivoreq = await getDirectivoById(directivo);
            const usuarioreq = await getUserByiD(directivoreq.usuario);
            setDirectivo_nombre(usuarioreq)
        }
        

        getBanda();
        getDirectivo();
    }, []);
    
  return (
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'125vh', padding:2, backgroundColor:'white', borderRadius:'5px', border:1, borderColor:'gray', boxShadow:' 5px 5px 10px' }}
        >   
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black', textDecoration: 'underline'}}>{banda_nombre}</Typography>
                </>
            </Grid>
            <Grid
            container
            >
                <Grid 
                item
                lg={5}
                xs= { 12 }
                sx={{ padding:2 }}
                >   
                    <div>
                        <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Fecha: <Typography  style={{display: 'inline-block'}}> { fecha }</Typography></Typography>
                    </div>
                    <div>
                        <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Estado: <Typography style={{display: 'inline-block'}}>{ estado } </Typography>   </Typography>
                    </div>
                    <div>
                        <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Rol: <Typography style={{display: 'inline-block'}}>{ rol }</Typography>   </Typography>
                    </div>
                    {
                        cargo &&
                        <div>
                                <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Instrumento: <Typography style={{display: 'inline-block'}}> { instrumento } </Typography></Typography>
                        </div>
                        
                    }
                    
                    {
                        instrumento &&
                            <div>
                                <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Instrumento: <Typography style={{display: 'inline-block'}}> { instrumento } </Typography></Typography>
                            </div>
                        
                    }
                    {   voz &&
                        <div>
                            <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Voz: <Typography style={{display: 'inline-block'}}>{ voz } </Typography></Typography>
                        </div>
                    }
                    <div>
                        <Typography style={{display: 'inline-block', fontWeight: 'bold'}}>Directivo: <Typography style={{display: 'inline-block'}}>{ directivo_nombre.nombre} { directivo_nombre.primer_apellido} { directivo_nombre.segundo_apellido}</Typography></Typography>
                    </div>
                </Grid>
                <Grid 
                    item
                    xs={12}
                    lg={7}
                    sx={{ padding:2 }}
                    >   
                        <Box>
                            <Typography style={{ fontWeight: 'bold'}}>Mensaje:</Typography>
                        </Box>
                        <Box>
                            <Typography > {mensaje}   </Typography>
                        </Box>
                </Grid>
                </Grid>
            { estado == 'Pendiente' &&
                <Grid
                container
                display="flex"
                justifyContent="center"
                alignItems="baseline"
                sx={{mt:'5px'}}>
                    <Button onClick={handleButtonAceptar} sx={{mr:'20px'}} variant='contained' align="center" >Aceptar</Button>
                    <Button  onClick={handleButtonRechazar} variant='contained' align="center" href="/auth/register">Denegar</Button>
                </Grid>
            }
        </Grid>
        
    );
}
