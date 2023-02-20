import { Grid, Typography } from '@mui/material';

export const AuthLayout = ({ children, title = ''}) => {
  return (
    <Grid 
      container
      spacing={ 0 }
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{minHeight: '100vh', backgroundColor: '#FFFFFF', padding: 4 }}
    >

      <Grid item 
        className='box-shadow' 
        xs= { 3 }
        sx={{ 
          width: { md: 450 },
          backgroundColor: '#262254', 
          padding: 3, 
          borderRadius: 2, 
        }}>
            <Typography align="center"  variant='h5' sx={{ mb: 1, color:'white' }}>{ title }</Typography>
              { children }
      </Grid>
    </Grid>
  )
}
