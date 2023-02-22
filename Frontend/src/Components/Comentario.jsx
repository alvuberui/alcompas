
import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    NavLink
} from "react-router-dom";
import Swal from 'sweetalert2';
import { useAuthStore, useComentariosStore } from '../hooks';
export const Comentario = ({ comentario, eliminar}) => {
    // Estados
    const [ comentarioF, setComentarioF ] = useState(comentario);
    const [ usuario, setUsuario ] = useState('');
    const horas  = new Date(comentario.fecha).getHours() + ":" + new Date(comentario.fecha).getMinutes();
    const fecha = new Date(comentario.fecha).toLocaleDateString();
    
    // Funciones
    const { getUserByiD, user } = useAuthStore();
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
                const c = await eliminarComentario(comentario._id);
                eliminar(comentario._id);
            }
        });
    }

    // Efectos
    useEffect(() => {
        const getUsuario = async () => {
            const c = comentario
            const usuarioreq = await getUserByiD(comentario.usuario);
            const usuario = usuarioreq.usuario;
            setUsuario(usuario);
            setComentarioF(c);
        }
        getUsuario();
    }, [  comentario ]);

  
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
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{comentario.titulo} </Typography>
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
                            <NavLink style={{textDecoration: "none", fontWeight:'bold', color: "black"}}  to={`/perfil/${comentarioF.usuarioId}`}>
                                @{usuario}: &nbsp;
                            </NavLink>
                            "{ comentarioF.texto }"
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
                        { user.uid === comentario.usuario && 
                            <Button aria-label='eliminar' color='primary' onClick={handleElminar} sx={{ml:'40px'}} variant='contained'>
                                <Typography sx={{ fontWeight: 'bold', fontSize:'12px' }} >Eliminar</Typography>
                            </Button>
                        }
                    </div>
                </Grid> 
            </Grid>
        </Grid>
        
    );
}