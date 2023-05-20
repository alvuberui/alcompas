import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, Navigate, useParams } from "react-router-dom";
import { Musico } from "../../../Components/Musico";
import {
  useArchiverosStore,
  useAuthStore,
  useContratadosStore,
  useDirectivosStore,
  useEventosStore,
} from "../../../hooks";
import { useAsistenciasStore } from "../../../hooks/useAsistenciasStore";

export const AsistenciaEvento = () => {
  const [evento, setEvento] = useState();
  const [asistencias, setAsistencias] = useState();
  const [contratados, setContratados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [esDirectivo, setEsDirectivo] = useState("a");
  const [esArchivero, setEsArchivero] = useState("a");

  const { eventoId } = useParams();
  const { tipoEvento } = useParams();

  const { getByTipoId } = useEventosStore();
  const { getTodasAsistenciasByEvento } = useAsistenciasStore();
  const { getDirectivoByUserId } = useDirectivosStore();
  const { getArchiverosByUserId } = useArchiverosStore();
  const { getContratadosByEnveto } = useContratadosStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const getEvento = async () => {
      const even = await getByTipoId(tipoEvento, eventoId);
      setEvento(even);
    };
    const getAsistencias = async () => {
      const asis = await getTodasAsistenciasByEvento(
        eventoId,
        tipoEvento === "Actuación"
          ? "Actuacion"
          : tipoEvento === "Procesión"
          ? "Procesion"
          : "Ensayo"
      );
      setAsistencias(asis);
    };
    getEvento();
    getAsistencias();
  }, [tipoEvento, eventoId]);

  useEffect(() => {
    const getContratados = async () => {
      if (evento) {
        const contratados = await getContratadosByEnveto(
          tipoEvento === "Actuación"
            ? "Actuacion"
            : tipoEvento === "Procesión"
            ? "Procesion"
            : "Ensayo",
          eventoId
        );
        setContratados(contratados);
      }
    };
    getContratados();
  }, [evento]);

  useEffect(() => {
    const getPermisos = async () => {
      if (evento) {
        const directivos = await getDirectivoByUserId(user.uid);
        const archiveros = await getArchiverosByUserId(user.uid);
        if (directivos.length === 0) setEsDirectivo(false);
        for (let i = 0; i < directivos.length; i++) {
          const directivo = directivos[i];
          if (directivo.banda === evento.banda && !directivo.fechaFin) {
            setEsDirectivo(true);
            break;
          } else {
            setEsDirectivo(false);
          }
        }
        if (archiveros.length === 0) setEsArchivero(false);
        for (let i = 0; i < archiveros.length; i++) {
          const archivero = archiveros[i];
          if (archivero.banda === evento.banda && !archivero.fechaFin) {
            setEsArchivero(true);
            break;
          } else {
            setEsArchivero(false);
          }
        }
      }
    };
    getPermisos();
  }, [evento]);

  useEffect(() => {
    const checkLoading = () => {
      if (
        evento != undefined &&
        asistencias != undefined &&
        tipoEvento != undefined &&
        esDirectivo != "a" &&
        esArchivero != "a"
      ) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    };
    checkLoading();
  }, [evento, tipoEvento, asistencias, esDirectivo, esArchivero]);

  const renderizar = () => {
    let html = [];

    const keys = Object.keys(asistencias);

    for (let i = 0; i < keys.length; i++) {
      const clave = keys[i];
      const key = clave.split(",");
      html.push(
        <Grid justifyContent="center" alignItems="center" key={key} container>
          <Typography sx={{ mt: 2 }} variant="h6" align="center" color="white">
            {" "}
            {key[0] + key[1]}{" "}
          </Typography>
        </Grid>
      );
      const lista = asistencias[key];
      if (lista) {
        for (let j = 0; j < lista.length; j++) {
          const value = lista[j];
          html.push(
            <Musico
              key={(j + 1) * (i + 1)}
              usuario={value[0]}
              tipo={"Directivo"}
              asistencia={value[1]}
            />
          );
        }
      }
    }
    // OBtenemos las claves de un objeto
    let i = 0;
    for (let clave in contratados) {
      i = i + 1;
      // Separamos la clave por coma y hacemos un array
      const key = clave.split(",");
      const value = contratados[key];
      // sustituir ' por " en el string key
      html.push(
        <Grid
          justifyContent="center"
          alignItems="center"
          key={key[0] + i}
          container
        >
          <Typography sx={{ mt: 2 }} variant="h6" align="center" color="white">
            {key[0]} Contratado{" "}
          </Typography>
        </Grid>
      );
      if (value) {
        html.push(
          <Musico
            key={key[1]}
            usuario={value}
            tipo={"Directivo"}
            contratado={true}
            contratadoId={key[1]}
            setContratados={setContratados}
          />
        );
      }
    }
    return html;
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress size={300} />
      </Box>
    );
  } else {
    return (
      <Grid
        container
        display="flex"
        justifyContent="center"
        alignItems="baseline"
      >
        {!esDirectivo && !esArchivero && <Navigate to="/" />}
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="baseline"
          sx={{ padding: 4 }}
        >
          <Grid
            item
            lg={10}
            xs={12}
            sx={{
              padding: 2,
              backgroundColor: "primary.main",
              borderRadius: "5px",
              boxShadow: " 1px 1px 1px 1px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", color: "white" }}
            >
              {tipoEvento + ": " + evento.titulo}{" "}
            </Typography>
          </Grid>
          <Grid
            container
            justifyContent="center"
            sx={{ mt: 2 }}
            alignItems="center"
          >
            {esDirectivo && (
              <Button sx={{ mb: 2, ml: 2 }} variant="contained" color="primary">
                <NavLink
                  style={{ textDecoration: "none", color: "white" }}
                  to={`/banda/panel/eventos/asistencia/contratar/${eventoId}/${tipoEvento}`}
                >
                  Añadir contratado
                </NavLink>
              </Button>
            )}

            <Grid
              item
              xs={11}
              justifyContent="center"
              alignItems="center"
              sx={{
                backgroundColor: "#262254",
                mt: "10px",
                borderRadius: "5px",
              }}
            >
              <Grid container spacing={1} m={1}>
                {renderizar().map((item, key) => {
                  return item;
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};
