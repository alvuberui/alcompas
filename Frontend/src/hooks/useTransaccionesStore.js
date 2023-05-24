import { useState } from "react";
import { alcompasAPI } from "../api";

export const useTransaccionesStore = () => {
  const [errores, setErrores] = useState([]);

  const crearTransaccion = async (transaccion) => {
    try {
      const { data } = await alcompasAPI.post("transacciones/", transaccion);
      const transaccionDB = data.transaccionDB;
      return transaccionDB;
    } catch (error) {
      setErrores("No tienes acceso a esta operación");
    }
  };

  const actualizarTransaccion = async (transaccion, id) => {
    try {
      const { data } = await alcompasAPI.put(
        `transacciones/${id}`,
        transaccion
      );
      const transaccionDB = data.transaccionDB;
      return transaccionDB;
    } catch (error) {
      setErrores("No tienes acceso a esta operación");
    }
  };

  const getByBanda = async (bandaId) => {
    try {
      const { data } = await alcompasAPI.get(`transacciones/banda/${bandaId}`);
      const transacciones = data.transacciones;
      return transacciones;
    } catch (error) {
      setErrores("No tienes acceso a esta operación");
    }
  };

  const deleteById = async (id) => {
    try {
      const { data } = await alcompasAPI.delete(`transacciones/${id}`);
      const transaccionDB = data.transaccionDB;
      return transaccionDB;
    } catch (error) {
      setErrores("No tienes acceso a esta operación");
    }
  };

  const getTransaccionesUltimoAño = async (bandaId) => {
    try {
      const { data } = await alcompasAPI.get(
        `transacciones/ano/banda/${bandaId}`
      );
      const transacciones = data.transacciones;
      return transacciones;
    } catch (error) {
      setErrores("No tienes acceso a esta operación");
    }
  };

  return {
    // Estado
    errores,
    // Métodos
    setErrores,
    crearTransaccion,
    getByBanda,
    actualizarTransaccion,
    deleteById,
    getTransaccionesUltimoAño,
  };
};
