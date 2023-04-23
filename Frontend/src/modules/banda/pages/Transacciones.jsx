import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress, Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRedesSocialesStore, useAuthStore, useDirectivosStore, useTransaccionesStore } from '../../../hooks';
import { NuevasRedSocial } from '../modals/NuevasRedSocial';
import { NuevoTransaccion } from '../modals/NuevaTransaccion';
// TABLA
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Swal from 'sweetalert2';
import { Documento } from '../../../Components/Documento';
import { PDFDownloadLink } from '@react-pdf/renderer';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export const Transacciones = () => {

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
    const [ vistaPdf, setVistaPdf ] = useState(false);

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
          
            cantidad = cantidad + t[i].cantidad;
          
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

    const handleDocumento = (e) => {
      e.preventDefault();
      setVistaPdf(true);
    }

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
                    <Typography variant="h4"  align="center" sx={{ fontWeight: 'bold' }} >Administración Económica</Typography>
                </Grid>
                {   
                    esTesorero &&
                    <Grid 
                    xs = { 4 }
                    sx={{ color:'white', mt:'20px', mb:'30px', justifyContent: "center", display: "flex", borderRadius: '10px' }}
                    item>
                            <Button onClick={handleOpen} variant='contained' align="center" sx={{color:'white', width:90}}  >Añadir</Button>  
                            <PDFDownloadLink document={<Documento transacciones={transacciones} />} fileName="transacciones.pdf">
                            <Button o variant='contained' align="center" sx={{color:'white', width:90, ml:2}}  >Imprimir</Button>  
                            </PDFDownloadLink>


                    </Grid>
                }
                <Grid 
                xs = { 11 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                item>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500}} aria-label="custom pagination table">
                            <TableBody>
                            <TableRow key={'first'}>
                                <TableCell style={{ width:'10%' }}>
                                    <Typography variant="body2" color="text.primary"  sx={{ fontWeight: 'bold' }} >Fecha</Typography>
                                </TableCell>
                                <TableCell style={{ width:'25%' }}>
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>Motivo</Typography>
                                </TableCell>
                                <TableCell style={{ width:'25%' }} >
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>Descripción</Typography>
                                </TableCell>
                                <TableCell style={{ width:'5%' }} >
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>Tipo</Typography>
                                </TableCell>
                                <TableCell style={{ width:'5%' }} >
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>Cantidad</Typography>
                                </TableCell>
                                <TableCell style={{ width:'5%' }} >
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>Acciones</Typography>
                                </TableCell>
                            </TableRow>
                            {(rowsPerPage > 0
                                ? transacciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : transacciones
                            ).map((row) => (
                                <TableRow key={row._id}>
                                <TableCell style={{ width:'10%' }}>
                                    {row.fecha}
                                </TableCell>
                                <TableCell style={{ width:'25%' }}>
                                    {row.motivo}
                                </TableCell>
                                <TableCell style={{ width:'25%' }} >
                                    {row.descripcion ? row.descripcion : 'Sin descripción'}
                                </TableCell>
                                <TableCell style={{ width:'5%' }} >
                                    {row.tipo}
                                </TableCell>
                                <TableCell style={{ width:'5%' }} >
                                    {row.cantidad}
                                </TableCell>
                                <TableCell style={{ width:'5%' }} >
                                    {
                                    
                                       esTesorero ?
                                        <>
                                          <IconButton onClick={ () => handleDelete(row._id) } > <DeleteIcon /> </IconButton>
                                          <IconButton onClick={ () => handleOpenEditar(row) }> <EditIcon/> </IconButton>
                                        </>
                                        :
                                        <>Sin permisos</>
                                      
                                    
                                    }
                                </TableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                                </TableRow>
                            )}
                            </TableBody>
                            <TableFooter>
                            <TableRow>
                                <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={transacciones.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                            </TableFooter>
                        </Table>
                        </TableContainer> 
                </Grid>
                <Grid 
                xs = { 11 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                item>
                    <Typography variant="h6"  align="center" sx={{ fontWeight: 'bold' }} >Total: {total}€</Typography>
                </Grid>

            </Grid>
        </>
  )}
}
