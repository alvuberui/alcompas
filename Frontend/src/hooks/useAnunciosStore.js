import { useState } from "react";
import { alcompasAPI } from "../api";

export const useAnunciosStore = () => {
  const [errores, setErrores] = useState([]);

  const crearAnuncio = async (anuncioNuevo) => {
    try {
      const { data } = await alcompasAPI.post("noticias/", anuncioNuevo);
      const anuncio = data.anuncioDB;
      return anuncio;
    } catch (error) {
      setErrores(["Error en el servidor, contacta con el administrador"]);
    }
  };

  const getAllPublicas = async () => {
    try {
      const { data } = await alcompasAPI.get("noticias/destacadas");
      const anuncios = data.anuncios;
      return anuncios;
    } catch (error) {
      setErrores(["Error en el servidor, contacta con el administrador"]);
    }
  };

  const getNoticiasByBanda = async (bandaId) => {
    try {
      const { data } = await alcompasAPI.get(`noticias/banda/${bandaId}`);
      const anuncios = data.anuncios;
      return anuncios;
    } catch (error) {
      setErrores(["Error en el servidor, contacta con el administrador"]);
    }
  };

  const deleteNoticia = async (id) => {
    try {
      const { data } = await alcompasAPI.delete(`noticias/id/${id}`);
      const anuncio = data.anuncio;
      return anuncio;
    } catch (error) {
      setErrores(["Error en el servidor, contacta con el administrador"]);
    }
  };

  return {
    // Estado
    errores,
    // Métodos
    setErrores,
    crearAnuncio,
    getAllPublicas,
    deleteNoticia,
    getNoticiasByBanda,
  };
};
