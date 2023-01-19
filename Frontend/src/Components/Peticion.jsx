
import { Box, Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore, useBandasStore, useDirectivosStore, useMusicosStore, usePeticionesStore } from '../hooks';

export const Peticion = ({ _id, estado, instrumento, mensaje, rol, voz, cargo, banda, usuario,  directivo, fecha }) => {
    // Estados
    const [ banda_nombre, setBanda ] = useState([]);
    const [ directivo_nombre, setDirectivo_nombre ] = useState([]);
    const { id } = useParams();
    const [ fechaLocal, setFechaLocal ] = useState();
    const [ userp, setUserp ] = useState([]);
    
    
    // Funciones
    const { getBandaById } = useBandasStore();
    const { getDirectivoById } = useDirectivosStore();
    const { getUserByiD, user } = useAuthStore();
    const { aceptarPeticion, rechazarPeticion } = usePeticionesStore();

    const handleButtonAceptar = (event)  => {
        event.preventDefault();
        const peticion = aceptarPeticion(_id);
        estado = 'Aceptada';
    };

    const handleButtonRechazar = (event)  => {  
        event.preventDefault();
        rechazarPeticion(_id);
        estado = 'Rechazada';
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
        const convertirFecha = () => {
            const fechaConvertida = new Date(fecha);
            setFechaLocal( fechaConvertida.toLocaleDateString());
        }
        const getUsuario = async () => {
            const u = await getUserByiD(usuario);
            setUserp(u);
        }
        

        getBanda();
        getDirectivo();
        convertirFecha();
        getUsuario();
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
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black', textDecoration: 'underline'}}>{banda_nombre.nombre}</Typography>
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
                        <Typography style={{display: 'inline-block'}}> <b>Fecha:</b>  { fechaLocal }</Typography>
                    </div>
                    <div>
                        <Typography style={{display: 'inline-block'}}><b>Estado:</b> { estado }  </Typography>
                    </div>
                    <div>
                        <Typography style={{display: 'inline-block'}}><b>Rol:</b> { rol }  </Typography>
                    </div>
                    {
                        cargo &&
                        <div>
                                <Typography style={{display: 'inline-block'}}><b>Instrumento:</b> { instrumento } </Typography>
                        </div>
                        
                    }
                    
                    {
                        instrumento &&
                            <div>
                                <Typography style={{display: 'inline-block'}}><b>Instrumento:</b> { instrumento } </Typography>
                            </div>
                        
                    }
                    {   voz &&
                        <div>
                            <Typography style={{display: 'inline-block'}}><b>Voz:</b> { voz }</Typography>
                        </div>
                    }
                    <div>
                        <Typography style={{display: 'inline-block'}}><b>Directivo:</b> { directivo_nombre.nombre} { directivo_nombre.primer_apellido} { directivo_nombre.segundo_apellido}</Typography>
                    </div>
                    <div>
                        <Typography style={{display: 'inline-block'}}><b>Destinatario:</b> { userp.nombre} { userp.primer_apellido} { userp.segundo_apellido}</Typography>
                    </div>
                </Grid>
                <Grid 
                    item
                    xs={12}
                    lg={7}
                    sx={{ padding:2 }}
                    >   
                        <Box>
                            <Typography ><b>Mensaje:</b> { mensaje } </Typography>
                        </Box> 
                </Grid>
                </Grid>
            { estado == 'Pendiente' && user.uid == usuario &&
                <Grid
                container
                display="flex"
                justifyContent="center"
                alignItems="baseline"
                sx={{mt:'5px'}}>
                    <Button onClick={handleButtonAceptar} sx={{mr:'20px'}} variant='contained' align="center" >Aceptar</Button>
                    <Button onClick={handleButtonRechazar} variant='contained' align="center" >Denegar</Button>
                </Grid>
            }
        </Grid>
        
    );
}
