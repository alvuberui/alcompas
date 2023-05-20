import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { Component } from "react";
import DateTimePicker from "react-datetime-picker";
import { AuthLayout } from "../../../auth/layout/AuthLayout";

import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "../../../Theme/picker.css";

export class PrimerPasoForm extends Component {
  continuar = (e) => {
    e.preventDefault();
    this.props.siguiente();
  };

  render() {
    const { values, handleChange, titulo, setValues } = this.props;

    return (
      <AuthLayout title={titulo}>
        <form>
          <Grid container>
            {titulo === "Crear Evento" && (
              <Grid item className="input-wrapper" xs={12} sx={{ mt: 2 }}>
                <label>Tipo del evento*</label>
                <FormControl
                  variant="outlined"
                  fullWidth
                  sx={{ minWidth: 120 }}
                >
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    fullWidth
                    value={values.tipoEvento}
                    onChange={handleChange("tipoEvento")}
                    inputProps={{ style: { color: "white" } }}
                    sx={{
                      "& fieldset": {
                        borderColor: "white",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white !important",
                      },
                      "& .MuiInputBase-input": {
                        color: "#e2e2e1",
                      },
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                      },
                      color: "white",
                    }}
                  >
                    <MenuItem value={"procesion"}>Procesión</MenuItem>
                    <MenuItem value={"actuacion"}>Actuación</MenuItem>
                    <MenuItem value={"ensayo"}>Ensayo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item className="input-wrapper" xs={12} sx={{ mt: 3 }}>
              <label>Título del evento*</label>
              <TextField
                type="text"
                placeholder="Título del evento"
                fullWidth
                onChange={handleChange("titulo")}
                defaultValue={values.titulo}
                color="secondary"
                inputProps={{ style: { color: "white" } }}
                focused
              />
            </Grid>
            <Grid item className="input-wrapper" xs={12} sx={{ mt: 3 }}>
              <label>Descripción del evento</label>
              <TextField
                type="text"
                placeholder="Descripción del evento"
                fullWidth
                onChange={handleChange("descripcion")}
                defaultValue={values.descripcion}
                color="secondary"
                rows={10}
                multiline
                inputProps={{ style: { color: "white" } }}
                focused
              />
            </Grid>
            <Grid item className="input-wrapper" xs={12} sx={{ mt: 3 }}>
              <label>Fecha y hora inicio*</label>
              <DateTimePicker
                id="datetime-picker"
                onChange={(value) =>
                  setValues({ ...values, ["fechaInicio"]: value })
                }
                value={values.fechaInicio}
              />
            </Grid>
            <Grid className="input-wrapper" item xs={12} sx={{ mt: 3 }}>
              <label>Fecha y hora de finalización*</label>
              <DateTimePicker
                id="datetime-picker"
                onChange={(value) =>
                  setValues({ ...values, ["fechaFin"]: value })
                }
                value={values.fechaFin}
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
          </Grid>
        </form>
      </AuthLayout>
    );
  }
}
