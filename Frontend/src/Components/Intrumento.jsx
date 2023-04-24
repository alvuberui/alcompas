
import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../hooks';
import { useInstrumentosStore } from '../hooks/useInstrumentosStore';
import { AñadirInstrumentoModal } from '../modules/user/';

export const Instrumento = ({ _id, instrumento, marca, modelo, numeroSerie, usuario, setInstrumentos, eliminar, iguales }) => {
    // Estados
    const [ usuarioPet, setUsuario ] = useState([]);
    const [ open, setOpen ] = useState(false);
    // Funciones
    const { getUserByiD } = useAuthStore();
    const { eliminarInstrumento } = useInstrumentosStore();
    

    const handleOpenEditar = (event, newValue, editar) => {
        event.preventDefault();
        setOpen(true);
    };
    const handleCloseEditar = (event, newValue) => {
        event.preventDefault();
        setOpen(false);
      };

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
            const c = await eliminarInstrumento(_id);
            
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
    }, [open]);

  
  return (
        
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'95%', padding:2, backgroundColor:'white', borderRadius:'5px',  borderColor:'white', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px'  }}
        >   
            <AñadirInstrumentoModal  instrumentoId={_id} editar={true} open={open} handleClose={handleCloseEditar} setOpen={setOpen} setInstrumentos={setInstrumentos}></AñadirInstrumentoModal>
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{instrumento} </Typography>
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
                            <b>Marca:</b> { marca || 'No especificado' }
                        </Typography>
                        <br></br>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Modelo:</b> {modelo || 'No especificado'}
                        </Typography>
                        <br></br>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Número de serie:</b> {numeroSerie || 'No especificado'}
                        </Typography>
                    </div>
                </Grid> 
                { iguales &&
                    <Grid 
                    item
                    xs= { 12 }
                
                    display="flex"
                    justifyContent="center"
                    alignItems="baseline"
                    >   
                        <div>
                            <Button color='primary' onClick={handleOpenEditar}  sx={{mr:'5px'}} variant='contained'>
                                <Typography sx={{ fontWeight: 'bold', fontSize:'12px' }} >Editar</Typography>
                            </Button>
                            <Button  color='primary' onClick={handleElminar} sx={{ml:'5px'}} variant='contained'>
                                <Typography sx={{ fontWeight: 'bold', fontSize:'12px' }} >Eliminar</Typography>
                            </Button>
                        </div>
                    </Grid> 
                }
            </Grid>
        </Grid>
        
    );
}