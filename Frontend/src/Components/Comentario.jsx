import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  useAuthStore,
  useComentariosStore,
  useLikesStore,
  useUploadsStore,
} from "../hooks";

import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";

export const Comentario = ({ comentario, eliminar }) => {
  // Estados
  const [usuario, setUsuario] = useState("");
  const [foto, setFoto] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [numeroLikes, setNumeroLikes] = useState(0);
  const horas =
    new Date(comentario.fecha).getHours() +
    ":" +
    new Date(comentario.fecha).getMinutes().toString().padStart(2, "0");
  const fecha = new Date(comentario.fecha).toLocaleDateString();

  // Funciones
  const { getUserByiD, user } = useAuthStore();
  const { eliminarComentario } = useComentariosStore();
  const { getFotoPerfilUsuario } = useUploadsStore();
  const {
    publicarLike,
    publicarDislike,
    getLikeByTipoAndReferencia,
    errores,
    getNumeroLikes,
  } = useLikesStore();

  const handleElminar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea eliminar su comentario?",
      text: "Esta acción será irreversible y no podrá recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await eliminarComentario(comentario._id);
        eliminar(comentario._id);
      }
    });
  };

  const handleLike = (e) => {
    e.preventDefault();
    const like = {
      usuario: user.uid,
      referencia: comentario._id,
      tipo: "Comentario",
    };
    publicarLike(like);
    setIsLiked(true);
    setNumeroLikes(numeroLikes + 1);
  };

  const handleDislike = (e) => {
    e.preventDefault();
    const like = { referencia: comentario._id, tipo: "Comentario" };
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
    const getUsuario = async () => {
      const usuarioreq = await getUserByiD(comentario.usuario);
      const usuario = usuarioreq.usuario;
      setUsuario(usuario);
    };
    const getFoto = async () => {
      const foto = await getFotoPerfilUsuario(comentario.usuario);
      setFoto(foto);
    };
    const getLike = async () => {
      const like = await getLikeByTipoAndReferencia({
        tipo: "Comentario",
        referencia: comentario._id,
      });

      if (like) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };
    getUsuario();
    getFoto();
    getLike();
  }, [comentario]);

  useEffect(() => {
    const getNumeroLikesF = async () => {
      const numeroLikes = await getNumeroLikes({
        tipo: "Comentario",
        referencia: comentario._id,
      });
      setNumeroLikes(numeroLikes);
    };
    getNumeroLikesF();
  }, [comentario]);

  return (
    <Card style={{ marginTop: "5px", width: "95%" }}>
      <CardHeader
        avatar={
          <NavLink to={`/perfil/${comentario.usuario}`}>
            <Avatar
              aria-label="recipe"
              src={`data:image/png;base64,${foto}`}
            ></Avatar>
          </NavLink>
        }
        action={
          user.uid === comentario.usuario && (
            <IconButton  onClick={handleElminar} aria-label="settings">
              <DeleteIcon />
            </IconButton>
          )
        }
        title={usuario + ": " + comentario.titulo}
        subheader={fecha + " " + horas}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {comentario.texto}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {isLiked ? (
          <IconButton onClick={handleDislike} aria-label="add to favorites">
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
      </CardActions>
    </Card>
  );
};
