import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUploadsStore } from "../hooks";

export const Estadistica = ({ banda, tipo }) => {
  const [foto, setFoto] = useState("");

  const { getFotoPerfilBanda } = useUploadsStore();

  useEffect(() => {
    const getFoto = async () => {
      const foto = await getFotoPerfilBanda(banda._id);
      setFoto(foto);
    };
    getFoto();
  }, []);

  return (
    <Card sx={{ mt: 1 }}>
      <CardHeader
        avatar={
          <NavLink to={`/banda/${banda._id}`}>
            <Avatar
              aria-label="recipe"
              src={`data:image/png;base64,${foto}`}
            ></Avatar>
          </NavLink>
        }
        title={banda.tipo + " " + banda.nombre}
        subheader={
          tipo === "popular"
            ? banda.numero + " me gusta"
            : tipo === "semana santa"
            ? banda.numero + " procesiones de semana santa"
            : banda.numero + " eventos"
        }
      />
    </Card>
  );
};
