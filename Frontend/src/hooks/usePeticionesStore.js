import { useState } from "react";
import { alcompasAPI } from "../api";
import { useAuthStore } from "./";

export const usePeticionesStore = () => {
  const [errores, setErrores] = useState([]);
  const { user } = useAuthStore();

  const getPeticionesByUserId = async (userId) => {
    try {
      const { data } = await alcompasAPI.get("peticiones/" + userId);
      const peticiones = data.peticiones;

      return peticiones;
    } catch (error) {
      console.log("Error cargando peticiones");
    }
  };

  const getPeticionesByBandaId = async (bandaId) => {
    try {
      const { data } = await alcompasAPI.get(
        "peticiones/peticionesByBandaId/" + bandaId
      );
      const peticiones = data.peticiones;

      return peticiones;
    } catch (error) {
      console.log("Error cargando peticiones");
    }
  };

  const aceptarPeticion = async (peticionId) => {
    try {
      const { data } = await alcompasAPI.put(
        "peticiones/aceptar/" + peticionId + "/" + user.uid
      );

      return data.peticionAceptada;
    } catch (error) {
      console.log("Error aceptando petición");
    }
  };

  const rechazarPeticion = async (peticionId) => {
    try {
      const { data } = await alcompasAPI.put(
        "peticiones/rechazar/" + peticionId + "/" + user.uid
      );
      return data.peticionRechazada;
    } catch (error) {
      console.log("Error rechazando petición");
    }
  };

  const crearPeticion = async (peticionForm, bandaId, directivoId) => {
    try {
      peticionForm.banda = bandaId;
      peticionForm.directivo = directivoId;
      const { data } = await alcompasAPI.post("peticiones/", peticionForm);
      const peticion = data.peticion;
      return peticion;
    } catch (error) {
      const erroresObj = error.response.data.errors;
      let res = [];

      for (const error in erroresObj) {
        res.push(erroresObj[error].msg);
      }

      if (error.response.data.msg) {
        res.push(error.response.data.msg);
      }
      setErrores(res);
    }
  };

  return {
    // Constantes
    errores,
    setErrores,

    // Métodos
    getPeticionesByUserId,
    aceptarPeticion,
    rechazarPeticion,
    getPeticionesByBandaId,
    crearPeticion,
  };
};
