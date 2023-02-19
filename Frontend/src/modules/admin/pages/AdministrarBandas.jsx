import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Buscador } from '../../../Components/Buscador';
import { useAuthStore, useBandasStore, useUploadsStore } from '../../../hooks';


export const AdministrarBandas = () => {
    const [ banda, setBanda ] = useState(undefined);
    const [ fotoPerfil, setFotoPerfil ] = useState([]);
    const { getFotoPerfilBanda } = useUploadsStore();
    const { eliminarBanda } = useBandasStore();
    const { getUserByiD, user } = useAuthStore();
    const [ admin, setAdmin ] = React.useState(true);

    // Efectos  
  useEffect(() => {
    const getFotoPerfil = async () => {
        if(banda !== undefined && banda !== null) {
            const resultado = await getFotoPerfilBanda(banda._id);
            setFotoPerfil(resultado);
        }
    }
    const getAdmin = async () => {
        const u = await getUserByiD(user.uid)
    
        if(u.administrador === false) {
            setAdmin(false);
        }       
    }
    getAdmin();
    getFotoPerfil();
  }, [banda]);

    const handleDelete = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórralo!'
            }).then(async (result) => {
            if (result.isConfirmed) {
                await eliminarBanda(banda._id);
                setBanda(undefined);
            }
        })
    }

 

    return (
        <>
        { admin === false && <Navigate to="/"/>}
        <Grid container justifyContent="center" alignItems="center" >
            <Grid 
            xs = { 9 }
            sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
            item>
            <h1 >Administración de Bandas</h1>
            </Grid>

            <Grid 
            xs = { 9 }
            sx={{ backgroundColor: '#262254', color:'white', mt:'20px', borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
            item>
                <Grid 
                xs = { 12 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex"  }}
                item>
                    <h3 aria-label='h3'>Buscar banda:</h3>
                </Grid>
                
                <Grid 
                xs = { 12 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", mb:'10px' }}
                item>
                    <Buscador tipo='admin' setBanda={setBanda}></Buscador>
                </Grid>
                {   banda  &&
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: '#262254', color:'white', mt:'20px'  }}
                    
                    item>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Avatar   style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src={`data:image/png;base64,${fotoPerfil}`}  />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h5' sx={{display:'inline-block', textAlign:'center'}}> { banda.tipo } { banda.nombre} </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h5' sx={{display:'inline-block', textAlign:'center'}}> { banda.año_fundacion } </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h5' sx={{display:'inline-block', textAlign:'center'}}> { banda.descripcion } </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h5' sx={{display:'inline-block', textAlign:'center'}}> { banda.correo } </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h6' sx={{display:'inline-block', textAlign:'center'}}> <b>Población:</b> { banda.localidad} ({ banda.provincia}) ({banda.codigo_postal})</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h6' sx={{display:'inline-block', textAlign:'center'}}> <b>Dirección:</b> { banda.direccion} </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h6' sx={{display:'inline-block', textAlign:'center'}}> <b>NIF:</b> { banda.cif} </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px' }}>
                            <Typography variant='h6' sx={{display:'inline-block', textAlign:'center'}}> <b>Teléfono:</b> { banda.telefono} </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt:'10px', mb:'20px' }}>
                            <Button  variant='contained'  onClick={handleDelete} color="error"  sx={{ width:'50vh', height:'50px'}}>Eliminar Banda</Button>
                        </Box>
                        
                        
                    </Grid>
                }
                
                
            
            </Grid>

        </Grid>
        </>
  );
}