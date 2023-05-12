
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
    const [ usuarioObjeto, setUsuarioObjeto ] = useState();

    
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
       
            setUsuarioObjeto(u);
        }
        getUsuario();
        getBanda();
        getDirectivo();
        convertirFecha();
        
    }, [usuario, _id]);

  return (
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'95%', padding:2, backgroundColor:'white', borderRadius:'5px',  borderColor:'white', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px'  }}
        >   
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{banda_nombre.tipo + ' ' + banda_nombre.nombre}</Typography>
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
                    { usuarioObjeto &&
                        <div>
                            <Typography style={{display: 'inline-block'}}><b>Destinatario:</b> { usuarioObjeto.nombre } { usuarioObjeto.primer_apellido } { usuarioObjeto.segundo_apellido }</Typography>
                        </div>
                    }
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
                    <Button aria-label='aceptar' onClick={handleButtonAceptar} sx={{mr:'20px'}} variant='contained' align="center" >Aceptar</Button>
                    <Button aria-label='denegar' onClick={handleButtonRechazar} variant='contained' align="center" >Denegar</Button>
                </Grid>
            }
        </Grid>
        
    );
}
