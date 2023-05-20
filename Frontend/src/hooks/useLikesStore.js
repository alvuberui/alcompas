import { useState } from "react";
import { alcompasAPI } from "../api";

export const useLikesStore = () => {
  const [errores, setErrores] = useState([]);

  const publicarLike = async (like) => {
    try {
      const { data } = await alcompasAPI.post("likes/", like);
      const likeDB = data.likeDB;
      return likeDB;
    } catch (error) {
      console.log(error);
      setErrores("No se pudo completar el like");
      setTimeout(() => {
        setErrores([]);
      }, 100);
    }
  };

  const publicarDislike = async (like) => {
    try {
      const { data } = await alcompasAPI.delete(
        "likes/tipo/" + like.tipo + "/referencia/" + like.referencia
      );
    } catch (error) {
      setErrores("No se pudo completar el dislike");
      setTimeout(() => {
        setErrores([]);
      }, 1000);
    }
  };

  const getLikeByTipoAndReferencia = async (likes) => {
    try {
      const { data } = await alcompasAPI.get(
        "likes/tipo/" + likes.tipo + "/referencia/" + likes.referencia
      );
      const like = data.like;
      return like;
    } catch (error) {}
  };

  const getNumeroLikes = async (likes) => {
    try {
      const { data } = await alcompasAPI.get(
        "likes/numero/tipo/" + likes.tipo + "/referencia/" + likes.referencia
      );
      const numeroLikes = data.likes;
      return numeroLikes;
    } catch (error) {}
  };

  return {
    // Estado
    errores,
    // Métodos
    setErrores,
    publicarLike,
    publicarDislike,
    getLikeByTipoAndReferencia,
    getNumeroLikes,
  };
};
