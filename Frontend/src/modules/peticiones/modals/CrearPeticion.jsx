import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../hooks/useAuthStore";

import { validarInstrumentos } from "../../../helpers/validarInstrumento";
import { useDirectivosStore, usePeticionesStore } from "../../../hooks";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vh",
  bgcolor: "#262254",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
};
const nombres = [
  "Corneta",
  "Tambor",
  "Bordonera",
  "Caja",
  "Bombo",
  "Platos",
  "Percusionista",
  "Tuba",
  "Trombón",
  "Bombardino",
  "Trompa",
  "Fliscorno",
  "Trompeta",
  "Saxofón Alto",
  "Saxofón Tenor",
  "Saxofón Barítono",
  "Clarinete",
  "Flauta",
  "Flautín",
  "Oboe",
  "Fagot",
  "Lira",
  "Campana",
  "Cascabeles",
  "Batería",
  "Xilófono",
  "Timbales",
  "Campanilla",
  "Clarinete Bajo",
  "Requinto",
];
const roles = ["Músico", "Directivo", "Archivero"];
const cargos = [
  "Presidente",
  "Vicepresidente",
  "Tesorero",
  "Secretario",
  "Vocal",
  "Representante",
  "Community Manager",
  "Director",
  "Subdirector",
];
const voces = ["Principal", "Primero", "Segundo", "Tercero"];

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export const CrearPeticion = ({
  open,
  handleClose,
  setPeticiones,
  setOpen,
  peticiones,
}) => {
  // Estados
  const [peticion, setPeticion] = useState({
    rol: "Músico",
    cargo: "Presidente",
    mensaje: "",
    instrumento: "Corneta",
    voz: "Primero",
    usuario: "",
  });
  const [rol, setRol] = useState("Músico");
  const { id } = useParams();
  const [openBuscador, setOpenBuscador] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const { getAllUsers } = useAuthStore();
  // Funciones
  const { getDirectivoByUserId } = useDirectivosStore();
  const { crearPeticion, errores, setErrores } = usePeticionesStore();
  const { user, getUserByUsername } = useAuthStore();

  const validarPeticion = async () => {
    let error = "";
    const todosUsuarios = await getAllUsers();
    const nombresUsuarios = todosUsuarios.map((usuario) => usuario.usuario);
    if (validarInstrumentos(peticion.instrumento) === false)
      error = error + " El instrumento no es válido ";
    if (!roles.includes(peticion["rol"]))
      error = error + " <br>  El rol no es válido";
    if (!cargos.includes(peticion["cargo"]))
      error = error + " <br>  El cargo no es válido";
    if (!voces.includes(peticion["voz"]))
      error = error + " <br>  El rol no es válido";
    if (peticion["mensaje"].length > 1000)
      error = error + " <br>  El mensaje debe máximo 250 caracteres";
    if (peticion["mensaje"].length < 1)
      error = error + " <br>  El mensaje debe tener mínimo 1 caracter";
    if (!nombresUsuarios.includes(peticion.usuario))
      error = error + " <br>  El usuario no existe";
    return error;
  };

  const handleForm = async (e) => {
    e.preventDefault();
    let error = await validarPeticion();

    if (error != "") {
      Swal.fire("Error al enviar petición", error, "error");
    } else {
      // Obtener el id del directivo a partir del userId
      const directivos = await getDirectivoByUserId(user.uid);

      // Obtener el userId a partir del username
      const usuario = await getUserByUsername(peticion.usuario);
      peticion.usuario = usuario[0]._id;

      // Dependiendo del rol, se eliminan las demás propiedades
      if (peticion.rol === "Músico") {
        delete peticion.cargo;
      } else if (peticion.rol === "Directivo") {
        delete peticion.instrumento;
        delete peticion.voz;
      } else {
        delete peticion.instrumento;
        delete peticion.voz;
        delete peticion.cargo;
      }
      let d = undefined;
      for (let i = 0; i < directivos.length; i++) {
        const directivo = directivos[i];
        if (directivo.banda === id && directivo.fecha_final == undefined) {
          d = directivo;
          break;
        }
      }
      // Crear la petición
      const p = await crearPeticion(peticion, id, d._id);
      setPeticiones([p, ...peticiones]);
      setPeticion({
        rol: "Músico",
        cargo: "Presidente",
        mensaje: "",
        instrumento: "Corneta",
        voz: "Primero",
        usuario: "",
      });

      setOpen(false);
    }
  };

  const handleChangeInput = (input) => (e) => {
    const { value } = e.target;
    setPeticion({ ...peticion, [input]: value });
    if (input === "rol") setRol(e.target.value);
  };

  useEffect(() => {
    if (errores.length > 0) {
      let error = "";
      for (let i = 0; i < errores.length; i++) {
        error = error + "<br>" + errores[i];
      }
      Swal.fire("Error al crear petición", error, "error");
      setErrores([]);
    }
  }, [errores]);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const usuarios = await getAllUsers();
        setOptions([...usuarios]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!openBuscador) {
      setOptions([]);
    }
  }, [openBuscador]);

  const handleChange = (event, values) => {
    event.preventDefault();
    peticion["usuario"] = values.usuario;
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="cambiar-contraseña"
      >
        <Box sx={style}>
          <form>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", color: "white" }}
            >
              Crear Petición
            </Typography>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Rol</Typography>
                <Select
                  style={{ color: "white", border: "1px solid #e2e2e1" }}
                  inputProps={{ style: { color: "white" } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={peticion.rol}
                  label="Age"
                  sx={{ width: "45vh", color: "white" }}
                  onChange={handleChangeInput("rol")}
                >
                  {roles.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Usuario</Typography>
                <Autocomplete
                  onChange={handleChange}
                  freeSolo={true}
                  id="asynchronous-demo"
                  sx={{
                    minWidth: "320px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    height: "50px",
                  }}
                  open={openBuscador}
                  onOpen={() => {
                    setOpenBuscador(true);
                  }}
                  onClose={() => {
                    setOpenBuscador(false);
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
                      sx={{ input: { color: "white" } }}
                      inputProps={{ style: { color: "white" } }}
                      style={{
                        backgroundColor: "#262254",
                        border: "1px solid #e2e2e1",
                        borderRadius: "5px",
                      }}
                      {...params}
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
              {rol === "Directivo" && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography sx={{ color: "white" }}>Cargo</Typography>
                  <Select
                    style={{ color: "white", border: "1px solid #e2e2e1" }}
                    inputProps={{ style: { color: "white" } }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={peticion.cargo}
                    label="Age"
                    sx={{ width: "45vh", color: "white" }}
                    onChange={handleChangeInput("cargo")}
                  >
                    {cargos.map((tipo, index) => (
                      <MenuItem key={index} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )}
              {rol === "Músico" && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography sx={{ color: "white" }}>Instrumento</Typography>
                  <Select
                    style={{ color: "white", border: "1px solid #e2e2e1" }}
                    inputProps={{ style: { color: "white" } }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={peticion.instrumento}
                    label="Age"
                    sx={{ width: "45vh", color: "white" }}
                    onChange={handleChangeInput("instrumento")}
                  >
                    {nombres.map((tipo, index) => (
                      <MenuItem key={index} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )}
              {rol === "Músico" && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography sx={{ color: "white" }}>Voz</Typography>
                  <Select
                    style={{ color: "white", border: "1px solid #e2e2e1" }}
                    inputProps={{ style: { color: "white" } }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={peticion.voz}
                    label="Age"
                    sx={{ width: "45vh", color: "white" }}
                    onChange={handleChangeInput("voz")}
                  >
                    {voces.map((tipo, index) => (
                      <MenuItem key={index} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Mensaje</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  type="text"
                  placeholder="Escriba aquí un mensaje..."
                  fullWidth
                  onChange={handleChangeInput("mensaje")}
                  defaultValue={peticion.mensaje}
                  rows={3}
                  multiline
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Button
                aria-label="enviar"
                color="secondary"
                sx={{ backgroundColor: "white", color: "black" }}
                variant="contained"
                onClick={handleForm}
              >
                Enviar Petición
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
