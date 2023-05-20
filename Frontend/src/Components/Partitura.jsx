import { useState } from "react";

import { usePartiturasStore } from "../hooks";

import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { createTheme } from "@mui/material/styles";
import Swal from "sweetalert2";

const theme = createTheme({
  components: {
    MuiIcon: {
      styleOverrides: {
        root: {
          // Match 24px = 3 * 2 + 1.125 * 16
          boxSizing: "content-box",
          padding: 3,
          fontSize: "1.125rem",
        },
      },
    },
  },
});

export const Partitura = ({
  partitura,
  eliminar,
  esArchivero,
  setPartitura,
}) => {
  const [hovered, setHovered] = useState(false);
  const { getPartituraById, eliminarPartitura } = usePartiturasStore();

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const p = await getPartituraById(partitura._id);
    setPartitura(p);
  };

  const handleElminar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: "¿Está seguro de que desea eliminar la partitura?",
      text: "Esta acción será irreversible y no podrá recuperarla",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await eliminarPartitura(partitura._id);
        if (c) {
          eliminar(partitura._id);
          Swal.fire({
            title: "Partitura eliminada",
            text: "La partitura ha sido eliminada correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        }
      }
    });
  };

  return (
    <Card
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      sx={{ mb: 5 }}
      style={{
        marginTop: "5px",
        width: "95%",
        backgroundColor: hovered ? "#F5F5F5" : "white",
        transition: "background-color 0.3s ease-out",
      }}
    >
      <CardHeader
        action={
          esArchivero && (
            <IconButton onClick={handleElminar} aria-label="settings">
              <DeleteIcon />
            </IconButton>
          )
        }
        title={partitura.instrumento + " " + partitura.voz}
      />
    </Card>
  );
};
