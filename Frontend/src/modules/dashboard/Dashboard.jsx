import { Box, Grid, List } from "@material-ui/core";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Calendario } from "../../Components/Calendario";
import { Noticia } from "../../Components/Noticia";
import { useAnunciosStore } from "../../hooks";

export const Dashboard = () => {
  // Estados
  const [noticias, setNoticias] = useState([]);

  // Hooks
  const { getAllPublicas } = useAnunciosStore();

  useEffect(() => {
    const getAnuncios = async () => {
      const userreq = await getAllPublicas();
      setNoticias(userreq.reverse());
    };
    getAnuncios();
  }, []);

  return (
    <>
      <Grid container direction="row">
        <Grid item lg={6} xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{ textAlign: "center", mt: 5, mb: 5 }}
            >
              Noticias Destacadas
            </Typography>
          </Box>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              "& ul": { padding: 0 },
            }}
          >
            {noticias.length > 0 ? (
              noticias.map((noticia, index) => (
                <Noticia
                  noticia={noticia}
                  index={index}
                  key={index}
                  setNoticias={setNoticias}
                />
              ))
            ) : (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ textAlign: "center", mt: 5, mb: 5 }}
                >
                  No hay noticias destacadas...
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ textAlign: "center", mt: 5, mb: 5 }}
                >
                  Vuelve en otro momento.
                </Typography>
              </>
            )}
          </List>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{ textAlign: "center", mt: 5, mb: 5 }}
            >
              Eventos Destacados
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
          >
            <Calendario tipo={"dashboard"} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
