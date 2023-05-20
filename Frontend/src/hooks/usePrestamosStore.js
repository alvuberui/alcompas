import Swal from "sweetalert2";
import { alcompasAPI } from "../api";

export const usePrestamosStore = () => {
  const crearPrestamo = async (prestamoForm, referenciaId) => {
    try {
      prestamoForm.referencia = referenciaId;
      const { data } = await alcompasAPI.post("prestamos/", prestamoForm);
      const prestamo = data.prestamo;

      return prestamo;
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

  const getPrestamoActivoByReferencia = async (referenciaId, tipo) => {
    try {
      const { data } = await alcompasAPI.get(
        "prestamos/activo/" + tipo + "/" + referenciaId
      );
      const prestamo = data.prestamo;
      return prestamo;
    } catch (error) {
      console.log(error);
      // Obtener los errores de la respuesta
      console.log("Error obteninedo el prestamo activo");
    }
  };

  const cancelarPrestamo = async (id) => {
    try {
      const { data } = await alcompasAPI.put("prestamos/cancelar/" + id);
      const prestamo = data.prestamo;
      return prestamo;
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

  const obtenerPrestamosUsuario = async (id) => {
    try {
      const { data } = await alcompasAPI.get("prestamos/usuario/" + id);
      const prestamos = data.prestamos;
      return prestamos;
    } catch (error) {
      console.log("Error obteniendo prestamos");
    }
  };

  const obtenerTodosByBanda = async (id) => {
    try {
      const { data } = await alcompasAPI.get("prestamos/banda/" + id);
      const prestamos = data.prestamos;
      return prestamos;
    } catch (error) {
      console.log("Error obteniendo prestamos");
    }
  };

  return {
    crearPrestamo,
    getPrestamoActivoByReferencia,
    cancelarPrestamo,
    obtenerPrestamosUsuario,
    obtenerTodosByBanda,
  };
};
