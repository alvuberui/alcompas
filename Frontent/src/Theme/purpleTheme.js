import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

// Creamos el tema 
export const purpleTheme = createTheme({
    palette: {
        primary: {
            main: '#262254'
        },
        secondary: {
            main: '#FFFFFF'
        },
        error: {
            main: red.A400
        }
    }
})