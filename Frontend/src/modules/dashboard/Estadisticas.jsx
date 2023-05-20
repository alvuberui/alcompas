import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Estadistica } from "../../Components";
import { useEstadisticasStore } from "../../hooks";

export const Estadisticas = () => {
  const [value, setValue] = useState(0);
  const [populares, setPopulares] = useState([]);
  const [contratosSemanaSanta, setContratosSemanaSanta] = useState([]);
  const [contratos, setContratos] = useState([]);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  const {
    getBandasConMasContratos,
    getBandasConMasContratosSemanaSanta,
    getBandasPopulares,
  } = useEstadisticasStore();

  useEffect(() => {
    const getPopulares = async () => {
      const response = await getBandasPopulares();
      setPopulares(response);
    };
    const getContratosSemanaSanta = async () => {
      const response = await getBandasConMasContratosSemanaSanta();
      setContratosSemanaSanta(response);
    };
    const getContratos = async () => {
      const response = await getBandasConMasContratos();
      setContratos(response);
    };
    getPopulares();
    getContratos();
    getContratosSemanaSanta();
  }, []);

  return (
    <Grid
      container
      sx={{ mt: 5 }}
      displey="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        lg={10}
        xs={12}
        sx={{
          padding: 2,
          mb: 5,
          backgroundColor: "primary.main",
          borderRadius: "5px",
          boxShadow:
            "rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", color: "white" }}>
          Estadísticas globales
        </Typography>
      </Grid>
      <Box
        xs={12}
        sx={{
          width: "95%",
          color: "white",
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "column",
          backgroundColor: "#262254",
          borderRadius: "5px",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          centered
          sx={{
            "& .MuiTabs-flexContainer": {
              flexWrap: "wrap",
            },
          }}
        >
          <Tab label="Más populares" />
          <Tab aria-label="click1" label="Con más contratos en semana santa" />
          <Tab aria-label="click2" label="Con más contratos" />
        </Tabs>
      </Box>
      <Box
        sx={{
          width: "95%",
          color: "white",
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "column",
          borderRadius: "5px",
        }}
      >
        {value === 0 &&
          populares.map((banda, index) => (
            <Estadistica {...banda} key={index} banda={banda} tipo="popular" />
          ))}
        {value === 1 &&
          contratosSemanaSanta.map((banda, index) => (
            <Estadistica
              {...banda}
              key={index}
              banda={banda}
              tipo="semana santa"
            />
          ))}
        {value === 2 &&
          contratos.map((banda, index) => (
            <Estadistica
              {...banda}
              key={index}
              banda={banda}
              tipo="contratos"
            />
          ))}
      </Box>
    </Grid>
  );
};
