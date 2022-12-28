
import { Grid, Typography, Button, Box } from '@mui/material';
import { useBandasStore, useDirectivosStore, useAuthStore, usePeticionesStore, useComentariosStore } from '../hooks';
import { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link,
    NavLink,
  }  from "react-router-dom";
import Swal from 'sweetalert2';
export const Comentario = ({ _id, titulo, texto, usuario, banda, fecha }, eliminar) => {
    // Estados
    const [ usuarioPet, setUsuario ] = useState([]);
    const horas  = new Date(fecha).getHours() + ":" + new Date(fecha).getMinutes();
    fecha = new Date(fecha).toLocaleDateString();
    
    // Funciones
    const { getUserByiD } = useAuthStore();
    const { eliminarComentario } = useComentariosStore();

    const handleElminar = e => {
        e.preventDefault();
        Swal
        .fire({
            title: "¿Está seguro de que desea eliminar su comentario?",
            text: "Esta acción será irreversible y no podrá recuperarlo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        .then(async resultado => {
            if (resultado.value) {
                // Hicieron click en "Sí"
                const c = await eliminarComentario(_id);
                
                eliminar(_id);
            }
        });
    }

    // Efectos
    useEffect(() => {
        const getUsuario = async () => {
            const usuarioreq = await getUserByiD(usuario);
            setUsuario(usuarioreq);  
        }
        getUsuario();
    }, [ ]);

  
  return (
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'125vh', padding:2, backgroundColor:'white', borderRadius:'5px', border:1, borderColor:'white', boxShadow:' 1px 1px 1px 1px' }}
        >   
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{titulo} </Typography>
                </>
            </Grid>
            <Grid
            container
            >
                <Grid 
                item
                xs= { 12 }
                sx={{ padding:2 }}
                >   
                    <div>
                        <Typography style={{display: 'inline-block'}}>
                            <NavLink style={{textDecoration: "none", fontWeight:'bold', color: "black"}}  to={`/perfil/${usuarioPet._id}`}>
                                @{usuarioPet.usuario}: &nbsp;
                            </NavLink>
                            "{ texto }"
                        </Typography>
                    </div>
                </Grid> 
                <Grid 
                item
                xs= { 12 }
             
                display="flex"
                justifyContent="center"
                alignItems="baseline"
                >   
                    <div>
                        <Typography style={{display: 'inline-block', fontSize:'13px'}}>
                            { fecha} a las { horas } horas
                        </Typography>
                        <Button color='primary' onClick={handleElminar} sx={{ml:'40px'}} variant='contained'>
                            <Typography sx={{ fontWeight: 'bold', fontSize:'12px' }} >Eliminar</Typography>
                        </Button>
                    </div>
                </Grid> 
            </Grid>
        </Grid>
        
    );
}