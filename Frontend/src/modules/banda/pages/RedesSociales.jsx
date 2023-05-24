import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  useAuthStore,
  useDirectivosStore,
  useRedesSocialesStore,
} from "../../../hooks";
import { NuevasRedSocial } from "../modals/NuevasRedSocial";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#262254",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const RedesSociales = () => {
  const [redesSociales, setRedesSociales] = React.useState([]);
  const { getAllByBandaId, eliminarRedSocial } = useRedesSocialesStore();
  const { bandaId } = useParams();
  const [open, setOpen] = React.useState(false);
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore();
  const [permiso, setPermiso] = useState("");

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleOpen = (event, newValue) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleEliminar = async (id) => {
    const red = await eliminarRedSocial(id);
    setRedesSociales((current) => current.filter((c) => c._id !== id));
  };

  useEffect(() => {
    const getRedes = async () => {
      const userreq = await getAllByBandaId(bandaId);
      setRedesSociales(userreq);
    };
    const getPermiso = async () => {
      const directivoreq = await getDirectivoByUserId(user.uid);
      let condicion = false;
      for (const directivo of directivoreq) {
        if (
          directivo.fecha_final === undefined &&
          directivo.banda === bandaId &&
          directivo.usuario === user.uid
        ) {
          condicion = true;
        }
      }
      setPermiso(condicion);
    };
    getPermiso();
    getRedes();
  }, []);

  if (permiso === "")
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress aria-label="cargando" size={200} />
        </Box>
      </>
    );
  else {
    return (
      <>
        {permiso === false && <Navigate to="/" />}
        <NuevasRedSocial
          open={open}
          handleClose={handleClose}
          setOpen={setOpen}
          setRedes={setRedesSociales}
        ></NuevasRedSocial>
        <Grid container justifyContent="center" alignItems="center">
          <Grid
            xs={9}
            sx={{
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
              borderRadius: "10px",
              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
            }}
            item
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", color: "white" }}
              aria-label="titulo"
            >
              Administración de redes sociales
            </Typography>
          </Grid>
          <Grid
            xs={4}
            sx={{
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
              borderRadius: "10px",
              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
            }}
            item
          >
            <Button
              onClick={handleOpen}
              variant="contained"
              align="center"
              sx={{ color: "white" }}
              fullWidth
              aria-label="añadir"
            >
              Añadir Red Social
            </Button>
          </Grid>

          <Grid
            xs={9}
            sx={{
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
              borderRadius: "10px",
              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
            }}
            item
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      URL de la red social
                    </StyledTableCell>
                    <StyledTableCell align="center">Nombre</StyledTableCell>
                    <StyledTableCell align="center">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {redesSociales.map((row) => (
                    <StyledTableRow key={row._id}>
                      <StyledTableCell align="center">
                        {row.url}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.nombre}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <IconButton
                          onClick={() => handleEliminar(row._id)}
                          sx={{ alignSelf: "flex-end" }}
                          color="error"
                          aria-label="upload picture"
                          component="label"
                        >
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  }
};
