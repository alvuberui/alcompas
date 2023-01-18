
import { Grid, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import {
    NavLink
} from "react-router-dom";
import { useUploadsStore } from '../hooks';


export const Banda = ({ _id, nombre, tipo, img }) => {
    const [ fotoPerfil, setFotoPerfil ] = useState('');
    const { getFotoPerfilBanda } = useUploadsStore();

    useEffect(() => {
        const getFoto = async () => {
            const foto = await getFotoPerfilBanda(_id);
            setFotoPerfil(foto);
        }
        getFoto();
    }, []);

  return (
        <Grid 
        item
        xs= { 10 }
        sx={{ mt:'15px', maxWidth:'125vh', padding:2, backgroundColor:'white', borderRadius:'5px', border:1, borderColor: 'white', boxShadow:' 1px 1px 1px 1px' }}
        >   
            <NavLink style={{textDecoration: "none", color: "black"}}  to={`/banda/${_id}`}>
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center">
                <Grid
                item
                xs= { 1.5 }
                >   
                    { fotoPerfil !== undefined && 
                        <Avatar sx={{width:'80px', height:'80px'}} src={`data:image/png;base64,${fotoPerfil}`} />
                    }
                </Grid>
                <Grid
                item
           
                xs= { 10 }
                >
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'left', color:'black', paddingLeft:'40px'}}>{tipo} {nombre}</Typography>
                </Grid>
                
                
            </Grid>
            </NavLink>
        </Grid>
    );
}
