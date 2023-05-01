
import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore, useVestimentasStore } from '../hooks';
import { useInstrumentosStore } from '../hooks/useInstrumentosStore';
import { AñadirInstrumentoModal } from '../modules/user/';
import { AñadirVestimenta } from '../modules/banda/modals/AñadirVestimenta';

export const Vestimenta = ({ vestimenta, iguales, banda, setVestimentas, eliminar }) => {
    // Estados
    const [ open, setOpen ] = useState(false);
    const { eliminarVestimenta } = useVestimentasStore();

    

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
        title: "¿Está seguro de que desea eliminar su vestimenta?",
        text: "Esta acción será irreversible y no podrá recuperarlo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    })
    .then(async resultado => {
        if (resultado.value) {
            // Hicieron click en "Sí"
           
                await eliminarVestimenta(vestimenta._id);
                eliminar(vestimenta._id);
           
            
        }
    });
    }


  
  return (
        
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'95%', padding:2, backgroundColor:'white', borderRadius:'5px',  borderColor:'white', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px'  }}
        >   
            <AñadirVestimenta  vestimentaAntigua={vestimenta} editar={true} open={open} handleClose={handleCloseEditar} setOpen={setOpen} setVestimentas={setVestimentas} banda={banda}></AñadirVestimenta>
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{vestimenta.tipo} </Typography>
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
                            <b>No hay información</b> 
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