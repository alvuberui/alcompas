import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { purpleTheme } from "./";

/* High Order Component: Componente que tiene otros en su interior */
export const AppTheme = ({children}) => {
  return (
    <ThemeProvider theme={ purpleTheme }>
        <CssBaseline/>
        { children }
    </ThemeProvider>
  )
}


