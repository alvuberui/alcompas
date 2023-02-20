import { Grid, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm, useAuthStore } from '../../hooks';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const loginFormCampos = {
  loginEmail: '',
  loginContraseña: ''
}

export const LoginPage = () => {

  const  { startLogin, errorMessage } = useAuthStore();

  const { loginEmail, loginContraseña, onInputChange:onLoginInputChange } = useForm(loginFormCampos);
  

  const loginSubmit = (event) => {
    event.preventDefault();
    startLogin({correo: loginEmail, contraseña: loginContraseña});
  }

  useEffect(() => {
    if(  errorMessage !== undefined ) {
      Swal.fire('Error en la autenticación', errorMessage, 'error');
    }
  }, [errorMessage])
  

  return (
    <AuthLayout title="Iniciar Sesión">
      <form onSubmit={loginSubmit}>
        <Grid container>

          <Grid item xs={ 12 } sx={{ mt: 2}}>
            <TextField 
              label="Correo electrónico"
              type="email"
              aria-label='correo'
              placeholder="correo@gmail.com"
              fullWidth
              name="loginEmail"
              color='secondary'
              defaultValue={loginEmail}
              onChange={onLoginInputChange}
              inputProps={{ style: { color: 'white' } }} 
              focused
            />
          </Grid>
          <Grid item xs={ 12 } sx={{ mt: 2}}>
            <TextField 
              aria-label="contraseña"
              label="Contraseña"
              type="password"
              fullWidth
              color='secondary'
              name="loginContraseña"
              placeholder='Contraseña'
              inputProps={{ style: { color: 'white' } }} 
              defaultValue={loginContraseña}
              onChange={onLoginInputChange}
              focused
            />
          </Grid>
            <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid  item xs={ 6 } >
                <Button aria-label='submit' variant='contained' color='secondary' fullWidth type='submit'>
                  Iniciar Sesión
                </Button>
              </Grid>
            </Grid>
          <Grid container direction='row' >
            <Grid item  justifyContent='start'>
              <Link aria-label='link' component={ RouterLink } style={{textDecoration:"none", color:"white"}} color='inherit' to="/">
                Volver al inicio
              </Link>
            </Grid>
            
            <Grid item  sx={{ ml:'20px' }} justifyContent='end'>
              <Link component={ RouterLink } style={{textDecoration:"none", color:"white"}} color='inherit' to="/auth/register">
                Crear una cuenta
              </Link>
            </Grid>
          </Grid>

        </Grid>
      </form>
    </AuthLayout>

  )
}


