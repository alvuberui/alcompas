import { CardHeader, Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUploadsStore } from "../hooks";

export const Banda = ({ _id, nombre, tipo }) => {
  const [fotoPerfil, setFotoPerfil] = useState("");
  const { getFotoPerfilBanda } = useUploadsStore();

  useEffect(() => {
    const getFoto = async () => {
      if(_id) {
        const foto = await getFotoPerfilBanda(_id);
        setFotoPerfil(foto);
      }
    };
    getFoto();
  }, [_id]);

  return (
    <Grid
      item
      xs={12}
      lg={10}
      sx={{
        mt: "15px",
        maxWidth: "125vh",
        padding: 2,
        backgroundColor: "white",
        borderRadius: "5px",
        border: 1,
        borderColor: "white",
        boxShadow:
          "rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px",
      }}
    >
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/banda/${_id}`}
      >
        <CardHeader
          aria-label="card"
          avatar={
            <Avatar
              sx={{ width: "80px", height: "80px" }}
              src={`data:image/png;base64,${fotoPerfil}`}
            />
          }
          title={tipo + " " + nombre}
          titleTypographyProps={{ variant: "h6" }}
        />
      </NavLink>
    </Grid>
  );
};
