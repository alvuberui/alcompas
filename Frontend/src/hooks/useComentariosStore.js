import { useState } from "react";
import { alcompasAPI } from "../api";
export const useComentariosStore = () => {
  const [errores, setErrores] = useState("");

  const getComentariosByBandaId = async (bandaId) => {
    try {
      const { data } = await alcompasAPI.get("comentarios/" + bandaId);
      const comentarios = data.comentarios;
      return comentarios;
    } catch (error) {
      console.log("Error cargando comentarios");
    }
  };

  const crearComentario = async (bandaId, comentarioNuevo, userId) => {
    try {
      comentarioNuevo.banda = bandaId;
      comentarioNuevo.usuario = userId;
      const { data } = await alcompasAPI.post("comentarios/", comentarioNuevo);
      const comentario = data.nuevoComentario;
      setErrores("200");
      return comentario;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setErrores(error.response.data?.msg);
      } else {
        setErrores(fallo);
      }
      setTimeout(() => {
        setErrores("");
      }, 10);
    }
  };

  const eliminarComentario = async (comentarioId) => {
    try {
      const { data } = await alcompasAPI.delete("comentarios/" + comentarioId);
      return data.comentario;
    } catch (error) {
      console.log("Error eliminando comentario");
    }
  };

  return {
    // Estado
    errores,
    // Métodos
    getComentariosByBandaId,
    crearComentario,
    eliminarComentario,
  };
};
