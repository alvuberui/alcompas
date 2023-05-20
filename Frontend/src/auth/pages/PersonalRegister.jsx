import { Button, Grid, Link, TextField } from "@mui/material";
import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";

export class PersonalRegister extends Component {
  continuar = (e) => {
    e.preventDefault();
    this.props.siguiente();
  };
  render() {
    const { values, handleChange, titulo } = this.props;

    return (
      <AuthLayout title={titulo}>
        <form>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="nombrelabel"
                label="Nombre"
                type="text"
                color="secondary"
                placeholder="Nombre"
                fullWidth
                onChange={handleChange("nombre")}
                inputProps={{ style: { color: "white" } }}
                defaultValue={values.nombre}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="primerApellidolabel"
                label="Primer apellido"
                type="text"
                color="secondary"
                placeholder="Apellido 1"
                fullWidth
                onChange={handleChange("primer_apellido")}
                inputProps={{ style: { color: "white" } }}
                defaultValue={values.primer_apellido}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="segundoApellidolabel"
                label="Segundo Apellido"
                type="text"
                color="secondary"
                placeholder="Apellido 2"
                fullWidth
                onChange={handleChange("segundo_apellido")}
                inputProps={{ style: { color: "white" } }}
                defaultValue={values.segundo_apellido}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="dnilabel"
                label="DNI"
                type="text"
                color="secondary"
                placeholder="DNI"
                fullWidth
                onChange={handleChange("nif")}
                inputProps={{ style: { color: "white" } }}
                defaultValue={values.nif}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="fechaNacimientolabel"
                label="Fecha nacimiento"
                type="date"
                fullWidth
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ style: { color: "white" } }}
                onChange={handleChange("fecha_nacimiento")}
                focused
                defaultValue={values.fecha_nacimiento}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="correolabel"
                label="Correo electrónico"
                type="email"
                color="secondary"
                placeholder="correo@gmail.com"
                fullWidth
                inputProps={{ style: { color: "white" } }}
                onChange={handleChange("correo")}
                defaultValue={values.correo}
                focused
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                aria-label="telefonolabel"
                label="Teléfono"
                type="tel"
                color="secondary"
                placeholder="666666666"
                fullWidth
                inputProps={{ style: { color: "white" } }}
                onChange={handleChange("telefono")}
                defaultValue={values.telefono}
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
            <Grid container direction="row">
              <Grid item justifyContent="start">
                <Link
                  component={RouterLink}
                  color="secondary"
                  style={{ textDecoration: "none", color: "white" }}
                  to="/"
                >
                  Inicio
                </Link>
              </Grid>
              {titulo === "Crear Cuenta" && (
                <Grid item sx={{ ml: "20px" }} justifyContent="end">
                  <Link
                    component={RouterLink}
                    color="secondary"
                    style={{ textDecoration: "none", color: "white" }}
                    to="/auth/login"
                  >
                    Iniciar Sesión
                  </Link>
                </Grid>
              )}
            </Grid>
          </Grid>
        </form>
      </AuthLayout>
    );
  }
}

export default PersonalRegister;
