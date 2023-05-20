import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthStore, useContratadosStore, useUploadsStore } from "../hooks";

export const Contratado = ({ musico }) => {
  const [usuario, setUsuario] = useState("");
  const [foto, setFoto] = useState("");

  const { tipoEvento } = useParams();
  const { eventoId } = useParams();

  const { getUserByiD } = useAuthStore();
  const { getFotoPerfilUsuario } = useUploadsStore();
  const { crearContratados } = useContratadosStore();

  useEffect(() => {
    const getUsuario = async () => {
      const u = await getUserByiD(musico.usuario);
      setUsuario(u);
    };
    getUsuario();
  }, [musico]);

  useEffect(() => {
    const getFoto = async () => {
      const f = await getFotoPerfilUsuario(musico.usuario);
      setFoto(f);
    };
    getFoto();
  }, [musico]);

  const handleContratar = async () => {
    Swal.fire({
      title: "¿Estás seguro contratar a este músico para el evento?",
      text: "Se añadirá a la asistencia del evento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, contratar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const contratado = {
          tipo:
            tipoEvento === "Procesión"
              ? "Procesión"
              : tipoEvento === "Actuación"
              ? "Actuacion"
              : "Ensayo",
          referencia: eventoId,
          usuario: musico.usuario,
          instrumento: musico.instrumento,
        };
        const b = await crearContratados(contratado);

        if (b) {
          Swal.fire(
            "Contratado!",
            "El músico ha sido contratado para el evento.",
            "success"
          );
        }
      }
    });
  };
  return (
    <Card style={{ marginTop: "5px", width: "100%" }}>
      <CardHeader
        avatar={
          <NavLink to={`/perfil/${musico.usuario}`}>
            <Avatar
              aria-label="recipe"
              src={`data:image/png;base64,${foto}`}
            ></Avatar>
          </NavLink>
        }
        title={
          usuario.nombre +
          " " +
          usuario.primer_apellido +
          " " +
          usuario.segundo_apellido +
          ": " +
          musico.instrumento
        }
        subheader={usuario.localidad + " " + usuario.provincia}
      />
      <CardActions disableSpacing>
        <Button variant="contained" onClick={handleContratar} color="primary">
          Contratar
        </Button>
      </CardActions>
    </Card>
  );
};
