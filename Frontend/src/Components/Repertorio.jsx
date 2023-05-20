import { useState } from "react";

import { useObrasStore, useRepertoriosStore } from "../hooks";

import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";

export const Repertorio = ({
  repertorio,
  eliminar,
  esArchivero,
  setObras,
  setRepertorio,
}) => {
  const { eliminarRepertorio } = useRepertoriosStore();
  const { getAllObrasByRepertorioId } = useObrasStore();

  const [hovered, setHovered] = useState(false);

  const handleObras = async () => {
    const obras = await getAllObrasByRepertorioId(repertorio._id);
    setRepertorio(repertorio);
    setObras(obras);
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
      title: "¿Está seguro de que desea eliminar el repertorio?",
      text: "Esta acción será irreversible y no podrá recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await eliminarRepertorio(repertorio._id);
        if (c) {
          eliminar(repertorio._id);
          Swal.fire({
            title: "Repertorio eliminado",
            text: "El repertorio ha sido eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        }
      }
    });
  };

  return (
    <Card
      onClick={handleObras}
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
        title={repertorio.titulo}
      />
      {repertorio.descripcion && (
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {repertorio.descripcion}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};
