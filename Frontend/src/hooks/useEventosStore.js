import { useState } from "react";
import Swal from "sweetalert2";
import { alcompasAPI } from "../api";
export const useEventosStore = () => {
  const [mensajeError, setMensajeError] = useState("");

  const crearActuacion = async (values) => {
    try {
      const { data } = await alcompasAPI.post("eventos/actuacion", values);
      const banda = data.banda;
      setMensajeError("200");
      setTimeout(() => {
        setMensajeError("");
      }, 10);

      return banda;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setMensajeError(error.response.data?.msg);
      } else {
        setMensajeError(fallo);
      }
      setTimeout(() => {
        setMensajeError("");
      }, 10);
    }
  };

  const crearEnsayo = async (values) => {
    try {
      const { data } = await alcompasAPI.post("eventos/ensayo", values);
      const banda = data.banda;
      setMensajeError("200");
      setTimeout(() => {
        setMensajeError("");
      }, 10);

      return banda;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setMensajeError(error.response.data?.msg);
      } else {
        setMensajeError(fallo);
      }
      setTimeout(() => {
        setMensajeError("");
      }, 10);
    }
  };

  const crearProcesion = async (values) => {
    try {
      const { data } = await alcompasAPI.post("eventos/procesion", values);
      const banda = data.banda;
      setMensajeError("200");
      setTimeout(() => {
        setMensajeError("");
      }, 10);

      return banda;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setMensajeError(error.response.data?.msg);
      } else {
        setMensajeError(fallo);
      }
      setTimeout(() => {
        setMensajeError("");
      }, 10);
    }
  };

  const actualizarProcesion = async (values, id) => {
    try {
      const { data } = await alcompasAPI.put("eventos/procesion/" + id, values);
      const procesion = data.procesionDB;
      setMensajeError("200");
      setTimeout(() => {
        setMensajeError("");
      }, 10);
      return procesion;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setMensajeError(error.response.data?.msg);
      } else {
        setMensajeError(fallo);
      }
      setTimeout(() => {
        setMensajeError("");
      }, 10);
    }
  };

  const actualizarActuacion = async (values, id) => {
    try {
      const { data } = await alcompasAPI.put("eventos/actuacion/" + id, values);
      const actuacion = data.actuacionDB;
      setMensajeError("200");
      setTimeout(() => {
        setMensajeError("");
      }, 10);
      return actuacion;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setMensajeError(error.response.data?.msg);
      } else {
        setMensajeError(fallo);
      }
      setTimeout(() => {
        setMensajeError("");
      }, 10);
    }
  };

  const actualizarEnsayo = async (values, id) => {
    try {
      const { data } = await alcompasAPI.put("eventos/ensayo/" + id, values);
      const ensayo = data.ensayoDB;
      setMensajeError("200");
      setTimeout(() => {
        setMensajeError("");
      }, 10);
      return ensayo;
    } catch (error) {
      let fallo = "";
      const objetos = Object(error.response.data.errors);
      for (const objeto in objetos) {
        let arreglo = objetos[objeto];
        fallo = arreglo["msg"];
        break;
      }
      if (error.response.data) {
        setMensajeError(error.response.data?.msg);
      } else {
        setMensajeError(fallo);
      }
      setTimeout(() => {
        setMensajeError("");
      }, 10);
    }
  };

  const getDestacados = async (fecha) => {
    try {
      const { data } = await alcompasAPI.post(
        "eventos/destacados/fecha",
        fecha
      );
      const eventos = data.eventos;
      return eventos;
    } catch (error) {
      setMensajeError("Error obteniendo los eventos");
    }
  };

  const getEventosByDateAndBanda = async (datos) => {
    try {
      const { data } = await alcompasAPI.post("eventos/banda/fecha", datos);
      const eventos = data.eventos;
      return eventos;
    } catch (error) {
      console.log("Error obteniendo el evento");
    }
  };

  const getByTipoId = async (tipo, id) => {
    try {
      const { data } = await alcompasAPI.get("eventos/" + tipo + "/id/" + id);
      const evento = data.evento;
      return evento;
    } catch (error) {
      console.log("Error obteniendo el evento");
    }
  };

  const deleteByTipoId = async (tipo, id) => {
    try {
      const { data } = await alcompasAPI.delete(
        "eventos/" + tipo + "/id/" + id
      );
      const evento = data.evento;
      return evento;
    } catch (error) {
      console.log("Error eliminando el evento");
    }
  };

  return {
    mensajeError,
    // Métodos,
    crearProcesion,
    crearActuacion,
    crearEnsayo,
    actualizarActuacion,
    actualizarEnsayo,
    actualizarProcesion,
    getDestacados,
    getEventosByDateAndBanda,
    getByTipoId,
    deleteByTipoId,
  };
};
