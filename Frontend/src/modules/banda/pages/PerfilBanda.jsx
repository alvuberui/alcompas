import Avatar from "@material-ui/core/Avatar";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Archivo,
  Calendario,
  Noticia,
  Partitura,
  Plantilla,
  Repertorio,
} from "../../../Components";
import { Comentario } from "../../../Components/Comentario";
import { Obra } from "../../../Components/Obra";
import {
  useAnunciosStore,
  useArchiverosStore,
  useAuthStore,
  useBandasStore,
  useComentariosStore,
  useDirectivosStore,
  useLikesStore,
  useMusicosStore,
  useRepertoriosStore,
  useUploadsStore,
} from "../../../hooks";
import { useRedesSocialesStore } from "../../../hooks/useRedesSocialesStore";
import { EditarFoto } from "../../user";
import { NuevaObra } from "../modals/NuevaObra";
import { NuevaPartitura } from "../modals/NuevaPartitura";
import { NuevoComentario } from "../modals/NuevoComentario";
import { NuevoRepertorio } from "../modals/NuevoRepertorio";

const r = [
  "Email",
  "Facebook",
  "Instagram",
  "Twitter",
  "Youtube",
  "Apple Music",
  " Soundcloud",
  "Spotify",
  "TikTok",
];

export const PerfilBanda = () => {
  // Estados
  const [banda, setBanda] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openRepertorio, setOpenRepertorio] = useState(false);
  const [openEditarFoto, setOpenEditarFoto] = useState(false);
  const [musicos, setMusicos] = useState({});
  const [usuariosMusicos, setUsuariosMusicos] = useState([]);
  const [usuariosDirectivos, setUsuariosDirectivos] = useState([]);
  const [usuariosArchiveros, setUsuariosArchiveros] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [directivos, setDirectivos] = useState({});
  const [redesSociales, setRedesSociales] = useState([]);
  const [perteneceMusico, setPerteneceMusico] = useState(false);
  const [perteneceDirectivo, setPerteneceDirectivo] = useState(false);
  const [anuncios, setAnuncios] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numeroLikes, setNumeroLikes] = useState(0);
  const [repertorios, setRepertorios] = useState([]);
  const [esArchivero, setEsArchivero] = useState(false);
  const [obras, setObras] = useState("");
  const [openObra, setOpenObra] = useState(false);
  const [repertorio, setRepertorio] = useState("");
  const [obra, setObra] = useState("");
  const [openPartitura, setOpenPartitura] = useState(false);
  const [partituras, setPartituras] = useState("");
  const [partitura, setPartitura] = useState("");
  const [archiveros, setArchiveros] = useState({});
  const [paginados, setPaginados] = useState([]);
  const [page, setPage] = useState(1);
  const [paginadosComentarios, setPaginadosComentarios] = useState([]);
  const [pageComentarios, setPageComentarios] = useState(1);

  const handleChangePaginados = (event, value) => {
    setPage(value);
    setPaginados(anuncios.slice((value - 1) * 5, value * 5));
  };

  const handleChangePaginadosComentarios = (event, value) => {
    setPage(value);
    setPageComentarios(comentarios.slice((value - 1) * 5, value * 5));
  };

  useEffect(() => {
    const updateComentariosPaginados = () => {
      setPaginadosComentarios(
        comentarios.slice((pageComentarios - 1) * 5, pageComentarios * 5)
      );
    };
    updateComentariosPaginados();
  }, [comentarios]);

  // Funciones
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleOpen = (event, newValue) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleOpenPartitura = (event, newValue) => {
    event.preventDefault();
    setOpenPartitura(true);
  };

  const handleClosePartitura = (event, newValue) => {
    event.preventDefault();
    setOpenPartitura(false);
  };

  const handleCloseRepertorio = (event, newValue) => {
    event.preventDefault();
    setOpenRepertorio(false);
  };

  const handleOpenRepertorio = (event, newValue) => {
    event.preventDefault();
    setOpenRepertorio(true);
  };

  const handleCloseObra = (event, newValue) => {
    event.preventDefault();
    setOpenObra(false);
  };

  const handleOpenObra = (event, newValue) => {
    event.preventDefault();
    setOpenObra(true);
  };

  const handleOpenEditarFoto = (event, newValue) => {
    event.preventDefault();
    setOpenEditarFoto(true);
  };

  const handleCloseEditarFoto = (event, newValue) => {
    event.preventDefault();
    setOpenEditarFoto(false);
  };

  const handleVolverObras = (event, newValue) => {
    event.preventDefault();
    setPartituras("");
  };

  const handleVolverPartituras = (event, newValue) => {
    event.preventDefault();
    setPartitura("");
  };

  const handleVolverRepertorio = (event, newValue) => {
    event.preventDefault();
    setObras("");
  };

  const handleLike = (e) => {
    e.preventDefault();
    const like = { usuario: user.uid, referencia: banda._id, tipo: "Banda" };
    publicarLike(like);
    setIsLiked(true);
    setNumeroLikes(numeroLikes + 1);
  };

  const handleDislike = (e) => {
    e.preventDefault();
    const like = { referencia: banda._id, tipo: "Banda" };
    publicarDislike(like);
    setIsLiked(false);
    setNumeroLikes(numeroLikes - 1);
  };

  const eliminarComentario = (comentarioId) => {
    // "current" contains the latest state array
    setComentarios([...comentarios.filter((c) => c._id !== comentarioId)]);
  };

  const eliminarRepertorio = (repertorioId) => {
    // "current" contains the latest state array
    setRepertorios([...repertorios.filter((c) => c._id !== repertorioId)]);
  };

  const eliminarObra = (obraId) => {
    // "current" contains the latest state array
    setObras([...obras.filter((c) => c._id !== obraId)]);
  };

  const eliminarPartitura = (partituraId) => {
    // "current" contains the latest state array
    setPartituras([...partituras.filter((c) => c._id !== partituraId)]);
  };

  const handleAbadonarBanda = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea deja la banda?",
      text: "Esta acción será irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, abandonar banda",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await abandonarBanda(bandaId, user.uid);
        //Redireccionar al inicio
        navigate("/");
      }
    });
  };

  const handleAbadonarBandaArchivero = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea dejar la banda como archivero?",
      text: "Esta acción será irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, abandonar banda",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await finalizarArchivero(user.uid, bandaId);
        //Redireccionar al inicio
        navigate("/");
        Swal.fire(
          "¡Has abandonado la banda!",
          "Has abandonado la banda como archivero",
          "success"
        );
      }
    });
  };

  // Hooks
  const { getBandaById } = useBandasStore();
  const { getComentariosByBandaId } = useComentariosStore();
  const { bandaId } = useParams();
  const { abandonarBanda, getMusicosBanda, esMusicoByBandaId } =
    useMusicosStore();
  const { getUserByiD } = useAuthStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { getFotoPerfilBanda } = useUploadsStore();
  const { getDirectivosByBandaId } = useDirectivosStore();
  const { getAllByBandaId } = useRedesSocialesStore();
  const { getNoticiasByBanda } = useAnunciosStore();
  const {
    publicarLike,
    publicarDislike,
    getLikeByTipoAndReferencia,
    errores,
    getNumeroLikes,
  } = useLikesStore();
  const { getAllRepertoriosByBandaId } = useRepertoriosStore();
  const { esArchiveroByBandaId, getArchiverosByBandaId, finalizarArchivero } =
    useArchiverosStore();

  useEffect(() => {
    const getBanda = async () => {
      const userreq = await getBandaById(bandaId);
      setBanda(userreq);
    };
    const getFotoPerfil = async () => {
      const foto = await getFotoPerfilBanda(bandaId);
      setFotoPerfil(foto);
    };
    const getRedes = async () => {
      const redes = await getAllByBandaId(bandaId);
      setRedesSociales(redes);
    };
    const getNoticias = async () => {
      const noticias = await getNoticiasByBanda(bandaId);
      setAnuncios(noticias);
      setPaginados(noticias.slice((1 - 1) * 5, 1 * 5));
    };
    getBanda();
    getFotoPerfil();
    getRedes();
    getNoticias();
  }, []);

  useEffect(() => {
    const esDirectivo = async () => {
      const directivos = await getDirectivosByBandaId(bandaId);
      const keys = Object.keys(directivos);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = directivos[key];
        for (let j = 0; j < element.length; j++) {
          const mus = element[j];
          if (mus.usuario === user.uid) {
            setPerteneceDirectivo(true);
          }
        }
      }
    };
    esDirectivo();
  }, []);

  useEffect(() => {
    const getComentarios = async () => {
      const userreq = await getComentariosByBandaId(bandaId);
      setComentarios(userreq.reverse());
      setPaginadosComentarios(userreq.slice((1 - 1) * 5, 1 * 5));
    };
    getComentarios();
  }, []);

  useEffect(() => {
    const esArchiveroF = async () => {
      const archivero = await esArchiveroByBandaId(bandaId);
      setEsArchivero(archivero);
    };
    const getRepertorios = async () => {
      const repertorios = await getAllRepertoriosByBandaId(bandaId);
      setRepertorios(repertorios);
    };
    esArchiveroF();
    getRepertorios();
  }, []);

  // Efectos
  useEffect(() => {
    const getMusicos = async () => {
      const musreq = await getMusicosBanda(bandaId);
      setMusicos(musreq);
    };
    const getDirectivos = async () => {
      const dirreq = await getDirectivosByBandaId(bandaId);
      setDirectivos(dirreq);
    };
    const getArchiveros = async () => {
      const dirreq = await getArchiverosByBandaId(bandaId);
      setArchiveros(dirreq);
    };
    getMusicos();
    getDirectivos();
    getArchiveros();
  }, []);

  useEffect(() => {
    const getUsuariosMusicos = async () => {
      let keys = Object.keys(musicos);
      let res = {};

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = musicos[key];
        let lista = [];
        for (let j = 0; j < element.length; j++) {
          const mus = element[j];
          const usuario = await getUserByiD(mus.usuario);
          lista.push(usuario);
        }
        res[key] = lista;
      }

      keys = Object.keys(directivos);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = directivos[key];
        let lista = [];
        for (let j = 0; j < element.length; j++) {
          const mus = element[j];
          const usuario = await getUserByiD(mus.usuario);
          lista.push(usuario);
        }
        res[key] = lista;
      }
      setUsuariosMusicos(res);
    };
    const getUsuariosDirectivos = async () => {
      let res = {};
      let keys = Object.keys(directivos);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = directivos[key];
        let lista = [];
        for (let j = 0; j < element.length; j++) {
          const mus = element[j];
          const usuario = await getUserByiD(mus.usuario);

          lista.push(usuario);
        }
        res[key] = lista;
      }
      setUsuariosDirectivos(res);
    };
    const getUsuariosArchiveros = async () => {
      let res = {};

      let keys = Object.keys(archiveros);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = archiveros[key];

        let lista = [];
        for (let j = 0; j < element.length; j++) {
          const mus = element[j];
          const usuario = await getUserByiD(mus.usuario);

          lista.push(usuario);
        }
        res[key] = lista;
      }
      setUsuariosArchiveros(res);
    };
    getUsuariosMusicos();
    getUsuariosDirectivos();
    getUsuariosArchiveros();
  }, [musicos, directivos, archiveros]);

  useEffect(() => {
    if (errores === "No se pudo completar el dislike") {
      Swal.fire("Error", "No se pudo eliminar el dislike", "error");
      setIsLiked(true);
    } else if (errores === "No se pudo completar el like") {
      Swal.fire("Error", "No se pudo eliminar el like", "error");
      setIsLiked(false);
    }
  }, [errores]);

  // Efectos
  useEffect(() => {
    const getLike = async () => {
      if (banda._id) {
        const like = await getLikeByTipoAndReferencia({
          tipo: "Banda",
          referencia: banda._id,
        });
        if (like) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    };
    getLike();
  }, [banda]);

  useEffect(() => {
    const esMusico = async () => {
      const mus = await esMusicoByBandaId(bandaId);
      setPerteneceMusico(mus);
    };
    esMusico();
  }, []);

  useEffect(() => {
    const getNumeroLikesF = async () => {
      if (banda._id) {
        const numeroLikes = await getNumeroLikes({
          tipo: "Banda",
          referencia: banda._id,
        });
        setNumeroLikes(numeroLikes);
      }
    };
    getNumeroLikesF();
  }, [banda]);

  return (
    <>
      <NuevaPartitura
        setPartituras={setPartituras}
        handleClose={handleClosePartitura}
        open={openPartitura}
        setOpen={setOpenPartitura}
        obra={obra}
      ></NuevaPartitura>
      <NuevaObra
        setObras={setObras}
        handleClose={handleCloseObra}
        open={openObra}
        setOpen={setOpenObra}
        repertorio={repertorio}
      ></NuevaObra>
      <NuevoComentario
        open={open}
        handleClose={handleClose}
        setOpen={setOpen}
        setComentarios={setComentarios}
      ></NuevoComentario>
      <EditarFoto
        setFoto={setFotoPerfil}
        open={openEditarFoto}
        handleClose={handleCloseEditarFoto}
        setOpen={setOpenEditarFoto}
        tipo={"banda"}
      ></EditarFoto>
      <NuevoRepertorio
        handleClose={handleCloseRepertorio}
        open={openRepertorio}
        setOpen={setOpenRepertorio}
        setRepertorios={setRepertorios}
      ></NuevoRepertorio>
      <Grid container justifyContent="center">
        <Grid
          item
          lg={3}
          xs={12}
          display="inline-flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{ mt: 5 }}
        >
          <Grid
            item
            xs={11.65}
            sx={{
              backgroundColor: "#262254",
              borderTopLeftRadius: "5px",
              borderRadius: "5px",
              padding: "10px",
              boxShadow:
                "rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {perteneceDirectivo ? (
                <a onClick={handleOpenEditarFoto}>
                  <Avatar
                    style={{ height: "150px", width: "150px" }}
                    alt="Remy Sharp"
                    src={`data:image/png;base64,${fotoPerfil}`}
                  />
                </a>
              ) : (
                <Avatar
                  style={{ height: "150px", width: "150px" }}
                  alt="Remy Sharp"
                  src={`data:image/png;base64,${fotoPerfil}`}
                />
              )}
              {isLiked ? (
                <Button
                  aria-label="like"
                  onClick={handleDislike}
                  sx={{
                    mt: 2,
                    backgroundColor: "rgba(10,10, 10, 0.5)",
                    opacity: 0.8,
                    color: "red",
                  }}
                  color="secondary"
                  startIcon={<FavoriteIcon />}
                >
                  {numeroLikes} Me gusta
                </Button>
              ) : (
                <Button
                  aria-label="dislike"
                  onClick={handleLike}
                  sx={{
                    mt: 2,
                    backgroundColor: "rgba(10,10, 10, 0.5)",
                    opacity: 0.8,
                  }}
                  color="secondary"
                  startIcon={<FavoriteIcon />}
                >
                  {numeroLikes} Me gusta
                </Button>
              )}
              <Typography
                color="white"
                sx={{ fontWeight: "bold", mt: 1, textAlign: "center" }}
                variant="h6"
              >
                {banda.tipo} {banda.nombre}
              </Typography>
              <Typography
                color="white"
                sx={{ fontWeight: "bold", textAlign: "center" }}
                variant="h6"
              >
                Fundada en {banda.año_fundacion}
              </Typography>
              <Typography
                color="white"
                sx={{ fontWeight: "bold", mt: 2, textAlign: "center" }}
                variant="h7"
              >
                Nuestra dirección:
              </Typography>
              <Typography
                color="white"
                sx={{ textAlign: "center" }}
                variant="h7"
              >
                {banda.localidad} ({banda.provincia}) {banda.codigo_postal}
              </Typography>
              <Typography
                color="white"
                sx={{ textAlign: "center" }}
                variant="h7"
              >
                {banda.direccion}
              </Typography>
              <Typography
                color="white"
                sx={{ fontWeight: "bold", mt: 2, textAlign: "center" }}
                variant="h7"
              >
                Descripción:
              </Typography>
              <Typography
                sx={{ fontStyle: "italic", textAlign: "center" }}
                color="white"
                variant="h7"
              >
                "{banda.descripcion}"
              </Typography>
              <Typography
                color="white"
                sx={{ fontWeight: "bold", mt: 2, textAlign: "center" }}
                variant="h7"
                aria-label="contacto"
              >
                ¿Quieres contactar con nosotros?
              </Typography>
              <Typography
                sx={{ textAlign: "center" }}
                color="white"
                variant="h7"
              >
                {banda.correo}
              </Typography>
              <Typography
                sx={{ textAlign: "center" }}
                color="white"
                variant="h7"
              >
                {banda.telefono}
              </Typography>
              {redesSociales.map((redSocial) => (
                <Grid key={redSocial._id} item xs={4} display="inline-block">
                  <Button
                    sx={{
                      backgroundColor: "white",
                      color: "primary.main",
                      mt: 1,
                      ml: 2,
                    }}
                    color="secondary"
                    href={redSocial.url}
                    size="small"
                    variant="contained"
                    align="center"
                  >
                    {redSocial.nombre === "Facebook" && (
                      <img
                        src="/Imagenes/facebook.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Instagram" && (
                      <img
                        src="/Imagenes/instagram.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Twitter" && (
                      <img
                        src="/Imagenes/twitter.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Youtube" && (
                      <img
                        src="/Imagenes/youtube.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Spotify" && (
                      <img
                        src="/Imagenes/spotify.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Soundcloud" && (
                      <img
                        src="/Imagenes/soundcloud.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Apple Music" && (
                      <img
                        src="/Imagenes/music.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "TikTok" && (
                      <img
                        src="/Imagenes/tik-tok.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {redSocial.nombre === "Email" && (
                      <img
                        src="/Imagenes/email.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                    {!r.includes(redSocial.nombre) && (
                      <img
                        src="/Imagenes/enlace.png"
                        alt="logo"
                        loading="lazy"
                      />
                    )}
                  </Button>
                </Grid>
              ))}
              {perteneceMusico && (
                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Button
                    sx={{ width: "250px" }}
                    color="error"
                    variant="contained"
                    align="center"
                    onClick={handleAbadonarBanda}
                    aria-label="abandonarmusico"
                  >
                    Abandonar Banda COMO MÚSICO
                  </Button>
                </Box>
              )}
              {esArchivero && (
                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Button
                    sx={{ width: "250px" }}
                    color="error"
                    variant="contained"
                    align="center"
                    onClick={handleAbadonarBandaArchivero}
                    aria-label="abandonararchivero"
                  >
                    Abandonar Banda como archivero
                  </Button>
                </Box>
              )}
              {perteneceDirectivo && (
                <>
                  <Box textAlign="center" sx={{ mt: 3 }}>
                    <Button
                      sx={{ width: "250px" }}
                      color="secondary"
                      variant="contained"
                      align="center"
                    >
                      <NavLink
                        style={{ textDecoration: "none", color: "black" }}
                        to={`/banda/panel/${banda._id}`}
                      >
                        Panel Directivo
                      </NavLink>
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid item lg={9} xs={12}>
          <Grid
            container
            sx={{ mt: 5 }}
            displey="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              xs={12}
              sx={{
                width: "97.3%",
                color: "white",
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "column",
                backgroundColor: "#262254",
                borderRadius: "5px",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                centered
                sx={{
                  "& .MuiTabs-flexContainer": {
                    flexWrap: "wrap",
                  },
                }}
              >
                <Tab aria-label="1" label="Anuncios" />
                <Tab aria-label="2" label="Eventos" />
                <Tab aria-label="3" label="Comentarios" />
                <Tab aria-label="4" label="Repertorios" />
                <Tab aria-label="5" label="Plantilla" />
              </Tabs>
            </Box>
          </Grid>
          <Grid
            container
            sx={{ mt: 1 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {value === 0 &&
              paginados.map((anuncio, index) => (
                <Noticia
                  noticia={anuncio}
                  index={index}
                  eliminar={eliminarComentario}
                  key={index}
                  setNoticias={setAnuncios}
                />
              ))}
            {value === 0 && anuncios.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                  mb: 5,
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(anuncios.length / 5)}
                    page={page}
                    onChange={handleChangePaginados}
                  />
                </Stack>
              </Box>
            )}
            {value === 0 && anuncios.length === 0 && (
              <Typography sx={{ textAlign: "center", mt: 2 }} variant="h7">
                No hay anuncios en esta banda
              </Typography>
            )}

            {value === 1 && <Calendario tipo={"perfil"} />}
            {value === 2 && (
              <Button
                color="primary"
                onClick={handleOpen}
                sx={{ mx: "auto", mb: "5px", width: "30vh", maxWidth: "4opx" }}
                variant="contained"
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Añadir Comentario
                </Typography>
              </Button>
            )}
            {value === 2 &&
              paginadosComentarios.map((comentario, index) => (
                <Comentario
                  eliminar={eliminarComentario}
                  comentario={comentario}
                  key={index}
                />
              ))}
            {value === 2 && comentarios.length === 0 && (
              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Typography sx={{ textAlign: "center", mt: 2 }} variant="h7">
                  No hay comentarios en esta banda
                </Typography>
              </Grid>
            )}
            {value === 2 && comentarios.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                  mb: 5,
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(comentarios.length / 5)}
                    page={pageComentarios}
                    onChange={handleChangePaginadosComentarios}
                  />
                </Stack>
              </Box>
            )}
            {value === 3 && (
              <>
                {partitura !== "" ? (
                  <Button
                    onClick={handleVolverPartituras}
                    color="primary"
                    sx={{ mb: "5px", width: "30vh", maxWidth: "4opx" }}
                    variant="contained"
                  >
                    <Typography>Volver a partituras</Typography>
                  </Button>
                ) : partituras !== "" ? (
                  <>
                    {esArchivero && (
                      <Button
                        onClick={handleOpenPartitura}
                        color="primary"
                        sx={{
                          mr: 2,
                          mb: "5px",
                          width: "30vh",
                          maxWidth: "4opx",
                        }}
                        variant="contained"
                      >
                        <Typography>Añadir Partitura</Typography>
                      </Button>
                    )}
                    <Button
                      onClick={handleVolverObras}
                      color="primary"
                      sx={{ mb: "5px", width: "30vh", maxWidth: "4opx" }}
                      variant="contained"
                    >
                      <Typography>Volver a obras</Typography>
                    </Button>
                  </>
                ) : obras !== "" ? (
                  <>
                    {esArchivero && (
                      <Button
                        onClick={handleOpenObra}
                        color="primary"
                        sx={{
                          mr: 2,
                          mb: "5px",
                          width: "30vh",
                          maxWidth: "4opx",
                        }}
                        variant="contained"
                      >
                        <Typography>Añadir Obra</Typography>
                      </Button>
                    )}
                    <Button
                      onClick={handleVolverRepertorio}
                      color="primary"
                      sx={{ mb: "5px", width: "30vh", maxWidth: "4opx" }}
                      variant="contained"
                    >
                      <Typography>Volver a repertorios</Typography>
                    </Button>
                  </>
                ) : (
                  <>
                    {esArchivero && (
                      <Button
                        onClick={handleOpenRepertorio}
                        color="primary"
                        sx={{
                          mx: "auto",
                          mb: "5px",
                          width: "30vh",
                          maxWidth: "4opx",
                        }}
                        variant="contained"
                      >
                        <Typography>Añadir Repertorio</Typography>
                      </Button>
                    )}
                  </>
                )}
                {partitura !== "" ? (
                  <Archivo partitura={partitura}></Archivo>
                ) : partituras !== "" ? (
                  partituras.length > 0 ? (
                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                      {partituras.map((partitura, index) => (
                        <Partitura
                          partitura={partitura}
                          key={index}
                          eliminar={eliminarPartitura}
                          esArchivero={esArchivero}
                          setPartitura={setPartitura}
                        ></Partitura>
                      ))}
                    </Grid>
                  ) : (
                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                      <Typography
                        sx={{ textAlign: "center", mt: 2 }}
                        variant="h7"
                      >
                        No hay partituras en esta banda
                      </Typography>
                    </Grid>
                  )
                ) : obras !== "" ? (
                  <>
                    {obras.length > 0 ? (
                      <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        {obras.map((obra, index) => (
                          <Obra
                            obra={obra}
                            eliminar={eliminarObra}
                            key={index}
                            setPartituras={setPartituras}
                            setObra={setObra}
                            esArchivero={esArchivero}
                            esDirectivo={perteneceDirectivo}
                            esMusico={perteneceMusico}
                          />
                        ))}
                      </Grid>
                    ) : (
                      <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <Typography
                          sx={{ textAlign: "center", mt: 2 }}
                          variant="h7"
                        >
                          No hay obras en esta banda
                        </Typography>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    {repertorios.map((repertorio, index) => (
                      <Repertorio
                        repertorio={repertorio}
                        eliminar={eliminarRepertorio}
                        key={index}
                        setObras={setObras}
                        setRepertorio={setRepertorio}
                        esArchivero={esArchivero}
                      />
                    ))}
                  </>
                )}
              </>
            )}
            {value === 3 && repertorios.length === 0 && (
              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Typography sx={{ textAlign: "center", mt: 2 }} variant="h7">
                  No hay repertorios en esta banda
                </Typography>
              </Grid>
            )}
            {value === 4 && (
              <>
                <Plantilla
                  musicos={musicos}
                  usuarios={usuariosMusicos}
                  tipo="Músicos"
                  directivo={perteneceDirectivo}
                  setComponente={setMusicos}
                />
                <Plantilla
                  musicos={directivos}
                  usuarios={usuariosDirectivos}
                  tipo="Directivos"
                  directivo={perteneceDirectivo}
                  setComponente={setDirectivos}
                />
                <Plantilla
                  musicos={archiveros}
                  usuarios={usuariosArchiveros}
                  tipo="Archiveros"
                  directivo={perteneceDirectivo}
                  setComponente={setArchiveros}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
