import { useState } from "react";
import Swal from "sweetalert2";
import { alcompasAPI } from "../api";

export const useAsistenciasStore = () => {
  const [errores, setErrores] = useState("");

  const crearAsistencia = async (asistencia) => {
    try {
      const { data } = await alcompasAPI.post("asistencias/", asistencia);
      const asistenciaDB = data.asistenciaDB;
      return asistenciaDB;
    } catch (error) {
      setErrores("No puedes dar de alta una asistencia que ya existe");
      // Obtener los errores de la respuesta
      const errors = error.response.data.errors;
      const error2 = error.response.data.msg;
      // Recorremos los errores para mostrarlos en el state
      let erroresArray = [];
      for (const key in errors) {
        erroresArray.push(errors[key].msg);
      }
      // Guardar los errores en el state
      if (erroresArray.length > 0) {
        Swal.fire({
          title: "Error",
          text: erroresArray[0],
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: error2,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const actualizarAsistencia = async (asistencia, asistenciaId) => {
    try {
      const { data } = await alcompasAPI.put(
        "asistencias/" + asistenciaId,
        asistencia
      );
      const asistenciaDB = data.asistenciaDB;
      return asistenciaDB;
    } catch (error) {
      // Obtener los errores de la respuesta
      const errors = error.response.data.errors;
      const error2 = error.response.data.msg;
      // Recorremos los errores para mostrarlos en el state
      let erroresArray = [];
      for (const key in errors) {
        erroresArray.push(errors[key].msg);
      }
      // Guardar los errores en el state
      if (erroresArray.length > 0) {
        Swal.fire({
          title: "Error",
          text: erroresArray[0],
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: error2,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const getAsistenciaByUsuarioEventoAndTipo = async (
    usuarioId,
    eventoId,
    tipoEvento
  ) => {
    try {
      const { data } = await alcompasAPI.get(
        `asistencias/usuario/${usuarioId}/evento/${eventoId}/tipo/${tipoEvento}`
      );
      const asistencia = data.asistencia;
      return asistencia;
    } catch (error) {
      console.log("Error cargando asistencia");
    }
  };

  const getTodasAsistenciasByEvento = async (eventoId, tipoEvento) => {
    try {
      const { data } = await alcompasAPI.get(
        `asistencias/evento/${eventoId}/tipo/${tipoEvento}`
      );
      const asistencias = data.resultado;
      return asistencias;
    } catch (error) {
      console.log("Error cargando asistencias");
    }
  };

  return {
    // Estado
    errores,
    setErrores,
    // Métodos
    crearAsistencia,
    actualizarAsistencia,
    getAsistenciaByUsuarioEventoAndTipo,
    getTodasAsistenciasByEvento,
  };
};
