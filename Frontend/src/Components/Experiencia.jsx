import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useBandasStore } from '../hooks';

export const Experiencia = ({experiencia}) => {

    const [ banda, setBanda ] = useState([]);

    const { getBandaById } = useBandasStore();

    useEffect(() => {
        const getBanda = async () => {
            const bandareq = await getBandaById(experiencia.banda);
            
            setBanda(bandareq);
        }
        getBanda();
    }, []);

  return (
    <Grid 
        container
        sx={{ mt:'15px', maxWidth:'95%', padding:2, backgroundColor:'white', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px'  }}
        >   
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>  
                    { experiencia.cargo !== undefined ?
                        <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>Experiencia como directivo</Typography>
                        : experiencia.instrumento !== undefined ?
                        <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>Experiencia como músico</Typography>
                        :
                        <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>Experiencia como archivero</Typography>
                    }
                </>
            </Grid>
            <Grid
            container
            >
                <Grid 
                item
                xs= { 12 }
                sx={{ padding:2 }}
                alignContent="center"
                justifyContent="center"
                display="inline-grid"
                >   
                    <div>
                        <Typography style={{textAlign:'center'}}> <b>Fecha de inicio:</b>  { experiencia.fecha_inicio }</Typography>
                    </div>
                    <div>
                        <Typography style={{textAlign:'center'}}><b>Fecha final:</b> { experiencia.fecha_final }  </Typography>
                    </div>
                    <div>
                        { experiencia.cargo && 
                            <Typography style={{textAlign:'center'}}> <b>Cargo: </b>  {experiencia.cargo}</Typography>
                        }
                    </div>
                    <div>
                        { experiencia.instrumento && 
                            <Typography style={{textAlign:'center'}}> <b>Instrumento: </b>  {experiencia.instrumento}</Typography>
                        }
                    </div>
                    <div>
                        { experiencia.voz && 
                            <Typography style={{textAlign:'center'}}> <b>Voz: </b>  {experiencia.voz}</Typography>
                        }
                    </div>
                    <div>
                        { banda && 
                            <Typography style={{textAlign:'center'}}> <b>Banda: </b>  {banda.tipo} {banda.nombre}</Typography>
                        }
                    </div>
                </Grid>
               
                
            </Grid>
          
        </Grid>
  )
}
