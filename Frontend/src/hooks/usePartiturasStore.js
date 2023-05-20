import axios from "axios";
import Swal from "sweetalert2";
import { alcompasAPI } from "../api";
import { getEnvVariables } from "../helpers";

export const usePartiturasStore = () => {
  const { VITE_API_URL } = getEnvVariables();

  const crearPartitura = async (obra, nuevaPartitura, pdf) => {
    nuevaPartitura.obra = obra._id;
    let formData = new FormData();
    formData.append("archivo", pdf);
    formData.append("partitura", JSON.stringify(nuevaPartitura));
    return axios({
      method: "post",
      url: VITE_API_URL + "/partituras/",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "x-token": localStorage.getItem("token"),
      },
    })
      .then(function (data) {
        const partitura = data.data.nuevaPartitura;
        return partitura;
      })
      .catch(function (error) {
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
      });
  };

  const verMisParituras = async (obra) => {
    try {
      const response = await alcompasAPI.get(`/partituras/obra/${obra}`);
      const partituras = response.data.partituras;
      return partituras;
    } catch (error) {
      console.log("Error obteniendo partituras");
    }
  };

  const getPartituraById = async (partituraId) => {
    return axios
      .get(VITE_API_URL + "/partituras/" + partituraId, {
        responseType: "arraybuffer",
        headers: { "x-token": localStorage.getItem("token") },
      })
      .then((res) => {
        const base64 = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        return base64;
      });
  };

  const eliminarPartitura = async (partituraId) => {
    try {
      const response = await alcompasAPI.delete(`/partituras/${partituraId}`);
      const partitura = response.data.partitura;
      return partitura;
    } catch (error) {
      console.log("Error eliminando partitura");
    }
  };

  return {
    crearPartitura,
    verMisParituras,
    getPartituraById,
    eliminarPartitura,
  };
};
