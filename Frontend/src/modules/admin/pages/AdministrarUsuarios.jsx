import Avatar from "@material-ui/core/Avatar";
import { Box, Button, Grid, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthStore, useUploadsStore } from "../../../hooks";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export const AdministrarUsuarios = () => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const { getAllUsers, deleteAdminById, getUserByiD, user } = useAuthStore();
  const [usuario, setUsuario] = useState(undefined);
  const [fotoPerfil, setFotoPerfil] = useState([]);
  const { getFotoPerfilUsuario } = useUploadsStore();
  const [admin, setAdmin] = React.useState(true);

  // Efectos
  useEffect(() => {
    const getFotoPerfil = async () => {
      if (usuario !== undefined && usuario !== null) {
        const resultado = await getFotoPerfilUsuario(usuario._id);
        setFotoPerfil(resultado);
      }
    };
    const getAdmin = async () => {
      const u = await getUserByiD(user.uid);

      if (u.administrador === false) {
        setAdmin(false);
      }
    };
    getAdmin();
    getFotoPerfil();
  }, [usuario]);

  const handleDelete = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const eliminado = await deleteAdminById(usuario._id);
        if (eliminado) {
          Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
          setUsuario(undefined);
        } else {
          Swal.fire("¡Error!", "El usuario no ha podido ser eliminado. Revise sus permisos o revise si el usuario es el último directivo de una banda", "error");
        }
        
      }
    });
  };

  const handleChange = (event, values) => {
    event.preventDefault();
    if (values !== null) {
      const fecha = new Date(values.fecha_nacimiento).toLocaleDateString();
      values.fecha_nacimiento = fecha;
    }
    setUsuario(values);
  };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const bandas = await getAllUsers();
        setOptions([...bandas]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
      {admin === false && <Navigate to="/" />}
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          lg={9}
          xs={11}
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
          <h1 style={{ textAlign: "center" }} aria-label="h3">
            Administración de Usuarios
          </h1>
        </Grid>

        <Grid
          lg={9}
          xs={11}
          sx={{
            backgroundColor: "#262254",
            color: "white",
            mt: "20px",
            borderRadius: "10px",
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
          }}
          item
        >
          <Grid
            xs={12}
            sx={{
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
            }}
            item
          >
            <h3>Buscar usuario:</h3>
          </Grid>

          <Grid
            xs={12}
            sx={{
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
            }}
            item
          >
            <Autocomplete
              onChange={handleChange}
              fullWidth={true}
              id="asynchronous-demo"
              sx={{
                minWidth: "300px",
                backgroundColor: "white",
                borderRadius: "5px",
                height: "50px",
                mb: "10px",
                ml: "50vh",
                mr: "50vh",
              }}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.usuario === value.usuario
              }
              getOptionLabel={(option) =>
                option.usuario ? option.usuario : ""
              }
              options={options}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  variant="filled"
                  {...params}
                  label="Buscar usuario por nombre de usuario..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {usuario && (
            <Grid
              xs={12}
              sx={{ backgroundColor: "#262254", color: "white", mt: "20px" }}
              item
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <NavLink to={'/perfil/' + usuario._id}>
                <Avatar
                  style={{ height: "150px", width: "150px" }}
                  alt="Remy Sharp"
                  src={`data:image/png;base64,${fotoPerfil}`}
                />
                </NavLink>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  @{usuario.usuario}{" "}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Nombre:</b> {usuario.nombre} {usuario.primer_apellido}{" "}
                  {usuario.segundo_apellido}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Fecha nacimiento:</b> {usuario.fecha_nacimiento}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Email:</b> {usuario.correo}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Descripción:</b> {usuario.descripcion}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Población:</b> {usuario.localidad} ({usuario.provincia}) (
                  {usuario.codigo_postal})
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Dirección:</b> {usuario.direccion}{" "}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>NIF:</b> {usuario.nif}{" "}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Teléfono:</b> {usuario.telefono}{" "}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "inline-block", textAlign: "center" }}
                >
                  {" "}
                  <b>Administrador:</b>{" "}
                  {usuario.administrador == true ? "Sí" : "No"}{" "}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: "10px",
                  mb: "20px",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleDelete}
                  color="error"
                  sx={{ width: "50vh", height: "50px", maxWidth: "300px" }}
                >
                  Eliminar Usuario
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
