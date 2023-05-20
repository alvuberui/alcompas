import { useState } from "react";

import { useObrasStore, usePartiturasStore } from "../hooks";

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

export const Obra = ({
  obra,
  eliminar,
  esArchivero,
  setPartituras,
  setObra,
  esDirectivo,
  esMusico,
}) => {
  const { eliminarObra } = useObrasStore();
  const [hovered, setHovered] = useState(false);
  const { verMisParituras } = usePartiturasStore();

  const handlePartituras = async (e) => {
    e.preventDefault();

    if (esArchivero || esDirectivo || esMusico) {
      const partituras = await verMisParituras(obra._id);

      setObra(obra);
      setPartituras(partituras);
    }
  };

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  const handleElminar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: "¿Está seguro de que desea eliminar la obra?",
      text: "Esta acción será irreversible y no podrá recuperarla",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await eliminarObra(obra._id);
        if (c) {
          eliminar(obra._id);
          Swal.fire({
            title: "Obra eliminada",
            text: "La obra ha sido eliminada correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        }
      }
    });
  };

  return (
    <Card
      onClick={handlePartituras}
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
        title={obra.titulo + " (" + obra.compositor + ")"}
      />
    </Card>
  );
};
