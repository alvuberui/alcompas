import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ListItem, ListItemButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  useAnunciosStore,
  useAuthStore,
  useBandasStore,
  useDirectivosStore,
  useLikesStore,
  useUploadsStore,
} from "../hooks";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const Noticia = ({ noticia, index, style, setNoticias }) => {
  // Estados
  const [expanded, setExpanded] = useState(false);
  const [banda, setBanda] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [esDirectivo, setEsDirectivo] = useState("");
  const horas =
    new Date(noticia.fecha).getHours() +
    ":" +
    new Date(noticia.fecha).getMinutes().toString().padStart(2, "0");
  const fecha = new Date(noticia.fecha).toLocaleDateString();
  const [isLiked, setIsLiked] = useState(false);
  const [numeroLikes, setNumeroLikes] = useState(0);

  // Hooks
  const { getBandaById } = useBandasStore();
  const { getFotoPerfilBanda } = useUploadsStore();
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore();
  const { deleteNoticia } = useAnunciosStore();
  const {
    publicarLike,
    publicarDislike,
    getLikeByTipoAndReferencia,
    errores,
    getNumeroLikes,
  } = useLikesStore();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const getBanda = async () => {
      const bandareq = await getBandaById(noticia.banda);
      bandareq.titulo = bandareq.tipo + " " + bandareq.nombre;
      setBanda(bandareq);
    };
    const getFoto = async () => {
      const fotoreq = await getFotoPerfilBanda(noticia.banda);
      setFotoPerfil(fotoreq);
    };
    getFoto();
    getBanda();
  }, []);

  useEffect(() => {
    const esDirectivo = async () => {
      const directivos = await getDirectivoByUserId(user.uid);
      if ( directivos && directivos.length === 0) setEsDirectivo(false);
      if( directivos ) {
      for (let i = 0; i < directivos.length; i++) {
        if (directivos[i].banda === banda._id && !directivos[i].fecha_final) {
          setEsDirectivo(true);
          break;
        } else {
          setEsDirectivo(false);
        }
      }}
    };
    esDirectivo();
  }, [banda, user]);

  const handleDelete = async () => {
    Swal.fire({
      title: "¿Está seguro de que desea eliminar su noticia?",
      text: "Esta acción será irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        const noticiaDelete = await deleteNoticia(noticia._id);
        // Eliminar noticia en setNoticias
        setNoticias((noticias) =>
          noticias.filter((not) => not._id !== noticiaDelete._id)
        );
      }
    });
  };

  const handleLike = (e) => {
    e.preventDefault();
    const like = {
      usuario: user.uid,
      referencia: noticia._id,
      tipo: "Noticia",
    };
    publicarLike(like);
    setIsLiked(true);
    setNumeroLikes(numeroLikes + 1);
  };

  const handleDislike = (e) => {
    e.preventDefault();
    const like = { referencia: noticia._id, tipo: "Noticia" };
    publicarDislike(like);
    setIsLiked(false);
    setNumeroLikes(numeroLikes - 1);
  };

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
      const like = await getLikeByTipoAndReferencia({
        tipo: "Noticia",
        referencia: noticia._id,
      });

      if (like) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };
    getLike();
  }, [noticia]);

  useEffect(() => {
    const getNumeroLikesF = async () => {
      const numeroLikes = await getNumeroLikes({
        tipo: "Noticia",
        referencia: noticia._id,
      });
      setNumeroLikes(numeroLikes);
    };
    getNumeroLikesF();
  }, [noticia]);
  if (esDirectivo === "") return <></>;
  else {
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <Card sx={{ width: "100%" }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500] }}
                  aria-label="recipe"
                  src={`data:image/png;base64,${fotoPerfil}`}
                ></Avatar>
              }
              action={
                esDirectivo && (
                  <IconButton onClick={handleDelete} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                )
              }
              title={banda.titulo}
              subheader={fecha + " a las " + horas}
            />
            <CardContent>
              <Typography
                variant="body1"
                fontWeight={"bold"}
                textTransform={"uppercase"}
                color="text.primary"
              >
                {noticia.titulo}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              {isLiked ? (
                <IconButton
                  onClick={handleDislike}
                  aria-label="add to favorites"
                >
                  <FavoriteIcon style={{ color: "#e53935" }} />
                </IconButton>
              ) : (
                <IconButton onClick={handleLike} aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              )}
              <Typography variant="body2" color="textSecondary" component="p">
                {numeroLikes} Me gusta
              </Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>{noticia.descripcion}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        </ListItemButton>
      </ListItem>
    );
  }
};
