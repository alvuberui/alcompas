import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

// Creamos el tema 
export const purpleTheme = createTheme({
    palette: {
        main: '#262224'
    },
    secondary: {
        main: '#543884'
    },
    error: {
        main: red.A400
    }
})