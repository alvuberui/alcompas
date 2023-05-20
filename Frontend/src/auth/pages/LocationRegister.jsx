import { Button, Grid, TextField } from "@mui/material";
import React, { Component } from "react";
import { AuthLayout } from "../layout/AuthLayout";

export class LocationRegister extends Component {
  continuar = (e) => {
    e.preventDefault();
    this.props.siguiente();
  };

  retroceder = (e) => {
    e.preventDefault();
    this.props.retroceder();
  };

  render() {
    const { values, handleChange, titulo } = this.props;
    return (
      <AuthLayout title={titulo}>
        <form>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="localidadlabel"
                label="Localidad"
                type="text"
                placeholder="Localidad"
                fullWidth
                color="secondary"
                onChange={handleChange("localidad")}
                defaultValue={values.localidad}
                inputProps={{ style: { color: "white" } }}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="provincialabel"
                label="Provincia"
                type="text"
                placeholder="Provincia"
                fullWidth
                color="secondary"
                onChange={handleChange("provincia")}
                defaultValue={values.provincia}
                inputProps={{ style: { color: "white" } }}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="codigoPostallabel"
                label="Código postal"
                type="text"
                placeholder="Código postal"
                fullWidth
                color="secondary"
                onChange={handleChange("codigo_postal")}
                defaultValue={values.codigo_postal}
                inputProps={{ style: { color: "white" } }}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Dirección"
                type="text"
                aria-label="direccion"
                placeholder="Direccion"
                fullWidth
                color="secondary"
                onChange={handleChange("direccion")}
                defaultValue={values.direccion}
                inputProps={{ style: { color: "white" } }}
                focused
              />
            </Grid>
            <Grid
              container
              justifyContent="center"
              spacing={2}
              sx={{ mb: 2, mt: 1 }}
            >
              <Grid item xs={6}>
                <Button
                  aria-label="retroceder"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.retroceder}
                >
                  Retroceder
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  aria-label="link"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.continuar}
                >
                  Siguiente
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </AuthLayout>
    );
  }
}

export default LocationRegister;
