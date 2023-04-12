
import { useEffect, useState } from 'react';
import { Box , List , Typography} from '@mui/material';
import Calendar from 'react-calendar';
import '../Theme/calendar.css'
import { useEventosStore } from '../hooks/useEventosStore';
import { Evento } from './Evento';
import { useParams } from 'react-router-dom';



export const Calendario = ({tipo}) => {
    const [value, onChange] = useState(new Date());
    const [eventos, setEventos] = useState([]);
    const { bandaId } = useParams();

    const { getDestacados, getEventosByDateAndBanda } = useEventosStore();
   
    useEffect(() => {
      const getEventos = async () => {
        if(tipo === 'dashboard') {
          const userreq = await getDestacados({ fecha: value });
          setEventos(userreq);
        }
        if(tipo === 'perfil') {
          const userreq = await getEventosByDateAndBanda({ 'fecha': value, 'banda': bandaId });
          setEventos(userreq);
        }
      }
      getEventos();
    }, [value]);

    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mb:5 }}
        >
          <Calendar 
          sx={{ border:'0px !important' }}
          style={{ border:'0px !important' }}
          className="react-calendar"
          onChange={onChange} 
          value={value} />
        
        </Box>
        <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              '& ul': { padding: 0 },
            }}
          >
            { eventos.length > 0 ?
              eventos.map((evento, index) => (
              <Evento evento={evento}  key={index} setEventos={setEventos}/>
              ))
              :
              <>
                <Typography variant="h6"  component="div" sx={{textAlign:'center', mt:5, mb:5}}>No hay eventos destacados el día seleccionado...</Typography>
                <Typography variant="h6"  component="div" sx={{textAlign:'center', mt:5, mb:5}}>Seleccione otro día o vuelva en otro momento.</Typography>
              </>
          }
          </List>
      </>
      );
}
