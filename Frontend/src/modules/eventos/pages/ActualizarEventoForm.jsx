import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { PrimerPasoForm, SegundoPasoForm } from "../";
import { validarEvento } from "../../../helpers/validarEvento";
import {
  useAuthStore,
  useDirectivosStore,
  useEventosStore,
} from "../../../hooks";

export const ActualizarEventoForm = () => {
  const [step, setStep] = useState(1);
  const [permiso, setPermiso] = useState("");
  const {
    actualizarProcesion,
    actualizarEnsayo,
    actualizarActuacion,
    mensajeError,
    getByTipoId,
  } = useEventosStore();
  const { tipoEvento } = useParams();
  const { eventoId } = useParams();
  const { getDirectivoByUserId } = useDirectivosStore();
  const { user } = useAuthStore();

  let navigate = useNavigate();

  useEffect(() => {
    if (mensajeError !== "" && mensajeError !== "200") {
      Swal.fire("Error Modificando Evento", mensajeError, "error");
    }
    setTimeout(() => {
      if (mensajeError === "200") {
        navigate("/banda/panel/eventos/" + values.banda);
        setValues({});
      }
    }, 100);
  }, [mensajeError]);

  useEffect(() => {
    const getEvento = async () => {
      const evento = await getByTipoId(tipoEvento, eventoId);

      evento.fechaInicio = new Date(evento.fechaInicio);
      evento.fechaFin = new Date(evento.fechaFin);

      if (tipoEvento === "Procesión") {
        evento.tipoEvento = "procesion";
        evento.fechaSalida = new Date(evento.fechaSalida);
      } else if (tipoEvento === "Ensayo") {
        evento.tipoEvento = "ensayo";
      } else if (tipoEvento === "Actuación") {
        evento.tipoEvento = "actuacion";
        evento.fechaSalida = new Date(evento.fechaSalida);
      }
      setValues(evento);
    };
    getEvento();
  }, [eventoId, tipoEvento]);

  const [values, setValues] = useState({});

  // Siguiente paso
  const siguiente = () => {
    setStep(step + 1);
  };

  // Anterior paso
  const previo = () => {
    setStep(step - 1);
  };

  // Confirmar

  const confirmar = () => {
    let error = validarEvento(values);

    if (error == "") {
      if (values.tipoEvento === "ensayo") actualizarEnsayo(values, eventoId);
      else if (values.tipoEvento === "procesion")
        actualizarProcesion(values, eventoId);
      else actualizarActuacion(values, eventoId);
    } else {
      Swal.fire("Error creando evento", error, "error");
    }
  };

  // Manejar los inputs
  const handleChange = (input) => (e) => {
    const { value } = e.target;
    setValues({ ...values, [input]: value });
  };

  useEffect(() => {
    const getPermiso = async () => {
      if (values.banda) {
        const directivoreq = await getDirectivoByUserId(user.uid);

        let condicion = false;

        for (const directivo of directivoreq) {
          if (
            directivo.fecha_final === undefined &&
            directivo.banda === values.banda &&
            directivo.usuario === user.uid
          ) {
            condicion = true;
          }
        }
        setPermiso(condicion);
      }
    };
    getPermiso();
  }, [values]);

  if (!values.tipoEvento)
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={200} />
        </Box>
      </>
    );
  else {
    if (permiso === "")
      return (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={200} />
          </Box>
        </>
      );
    else {
      switch (step) {
        case 1:
          return (
            <>
              {permiso === false && <Navigate to="/" />}
              <PrimerPasoForm
                siguiente={siguiente}
                handleChange={handleChange}
                values={values}
                titulo="Editar Evento"
                setValues={setValues}
              />
            </>
          );
        case 2:
          return (
            <>
              {permiso === false && <Navigate to="/" />}
              <SegundoPasoForm
                confirmar={confirmar}
                retroceder={previo}
                handleChange={handleChange}
                values={values}
                titulo="Editar Evento"
                setValues={setValues}
              />
            </>
          );
      }
    }
  }
};

export default ActualizarEventoForm;
