import { Box, Grid, List, Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";
import "../Theme/calendar.css";
import { useEventosStore } from "../hooks/useEventosStore";
import { Evento } from "./Evento";

export const Calendario = ({ tipo }) => {
  const [value, setValue] = useState(format(new Date(), "yyyy-MM-dd"));
  const [eventos, setEventos] = useState([]);
  const { bandaId } = useParams();

  const { getDestacados, getEventosByDateAndBanda } = useEventosStore();
  const onChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setValue(formattedDate);
  };
  useEffect(() => {
    const getEventos = async () => {
      if (tipo === "dashboard") {
        const userreq = await getDestacados({
          fecha: new Date(value).toISOString(),
        });
        setEventos(userreq);
      }
      if (tipo === "perfil") {
        const userreq = await getEventosByDateAndBanda({
          fecha: new Date(value).toISOString(),
          banda: bandaId,
        });
        setEventos(userreq);
      }
    };
    getEventos();
  }, [value, tipo]);

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 5, width: "100%", border: "0px !important" }}
          >
            <Calendar
              locale="es-ES"
              className="react-calendar"
              onChange={onChange}
              value={value}
              showNeighboringMonth={false}
              calendarType="ISO 8601"
              returnValue="start"
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 5, width: "100%", border: "0px !important" }}
          >
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                "& ul": { padding: 0 },
              }}
            >
              {eventos.length > 0 ? (
                eventos.map((evento, index) => (
                  <Evento evento={evento} key={index} setEventos={setEventos} />
                ))
              ) : (
                <>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ textAlign: "center", mt: 5, mb: 5 }}
                  >
                    No hay eventos destacados el día seleccionado...
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ textAlign: "center", mt: 5, mb: 5 }}
                  >
                    Seleccione otro día o vuelva en otro momento.
                  </Typography>
                </>
              )}
            </List>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
