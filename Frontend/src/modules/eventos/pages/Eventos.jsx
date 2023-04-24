import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress, Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useRedesSocialesStore, useAuthStore, useDirectivosStore, useTransaccionesStore } from '../../../hooks';
import { Calendario } from '../../../Components';
import { NuevoTransaccion } from '../../banda/modals/NuevaTransaccion';
import Swal from 'sweetalert2';

export const Eventos = () => {

    // Estados
    const [ transacciones, setTransacciones ] = React.useState([]);
    const [ transaccion, setTransaccion ] = React.useState(undefined);
    const [ open, setOpen ] = useState(false);
    const [ openEditar, setOpenEditar ] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [ total,  setTotal ] = useState(0);
    const [ esDirectivo, setEsDirectivo ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ esTesorero, setEsTesorero ] = useState(false);
    const navigate = useNavigate();

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transacciones.length) : 0;

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

    // Hooks
    const { getByBanda, deleteById } = useTransaccionesStore();
    const { bandaId } = useParams();
    const { user } = useAuthStore();
    const { getDirectivoByUserId } = useDirectivosStore();

    const updateFecha = (t) => {
      const transacciones2 = [];
      let cantidad = 0;
        for(let i = 0; i < t.length; i++){
          const fecha = new Date(t[i].fecha);
          const año = fecha.getFullYear();
          const mes = (fecha.getMonth() + 1).toString().length == 1 ? "0"+ (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
          const dia = fecha.getDate().toString().length == 1 ? "0"+ fecha.getDate() : fecha.getDate();
          const fecha2 = año + "-" + mes + "-" + dia;
          t[i].fecha = fecha2;
          transacciones2.push(t[i]);
          if(t[i].tipo === 'Beneficio'){
            cantidad = cantidad + t[i].cantidad;
          }else{
            cantidad = cantidad - t[i].cantidad;
          }
        }
        setTotal(cantidad);
        return transacciones2.reverse();
    }

    const handleClose = (event, newValue) => {
        event.preventDefault();
        setOpenEditar(false);
        setTransaccion(undefined);
        setOpen(false);
    };
    
    
    const handleOpen = (event, newValue) => {
        event.preventDefault();
        setOpen(true);
    };

  
  
    const handleOpenEditar = (newValue) => {
        setTransaccion(newValue);
        setOpenEditar(true);
        setOpen(true);
    };

    const renviarCrear = async (event) => {
        event.preventDefault();
        navigate("/banda/panel/eventos/crear/" + bandaId);
    }
    

    const handleDelete = async (id) => {
        Swal.fire({
            title: '¿Estás seguro de que quiere eliminar la transacción?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórrala!'
          }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteById(id);
                const transacciones = await getByBanda(bandaId);
                const transacciones2 = updateFecha(transacciones);
                setTransacciones(transacciones2);
                Swal.fire(
                    '¡Borrada!',
                    'La transacción ha sido borrada.',
                    'success'
                )
            }
          })
    }

    useEffect(() => {
        const getDirectivo = async () => {
            const directivos = await getDirectivoByUserId(user.uid);
            for( let i = 0; i < directivos.length; i++){

                if(directivos[i].banda === bandaId && !directivos[i].fecha_final ){
                    setEsDirectivo(true);
                    if(directivos[i].cargo === 'Tesorero'){
                        setEsTesorero(true);
                    }
                }
            }
            setLoading(false);
        }
        getDirectivo();
    }, [])

    useEffect(() => {
        const getTransacciones = async () => {
            const transacciones = await getByBanda(bandaId);
            const transacciones2 = updateFecha(transacciones);
            setTransacciones(transacciones2);
        }
        getTransacciones();
    }, [bandaId])

    if(loading){
        return <CircularProgress />

    } else {
    
    return (
        <>
            { esDirectivo === false && <Navigate to='/' /> }
            <NuevoTransaccion handleClose={handleClose} open={open}  setOpen={setOpen} setTransacciones={setTransacciones} editar={openEditar} transaccion={transaccion}
              setTotal={setTotal} setOpenEditar={setOpenEditar}/>
            <Grid container justifyContent="center" alignItems="center" >
                <Grid 
                xs = { 9 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                item>
                    <Typography variant="h4"  align="center" sx={{ fontWeight: 'bold' }} >Administración de Eventos</Typography>
                </Grid>
                {   
                    esDirectivo &&
                    <Grid 
                    xs = { 4 }
                    sx={{ backgroundColor: '#262254', color:'white', mt:'20px', mb:'30px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                    item>
                            <Button onClick={renviarCrear} variant='contained' align="center" sx={{color:'white'}} fullWidth >Añadir Evento</Button>    
                    </Grid>
                }
                <Grid 
                xs = { 10 }
                item
                >
                  <Calendario tipo='perfil'></Calendario>
                </Grid>
                
            </Grid>
        </>
  )}
}
