import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBandasStore } from '../hooks/useBandasStore';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export  function Buscador( { tipo, setBanda}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const { getBandas } = useBandasStore();
  let navigate = useNavigate();

  const handleChange = (event, values) => {
    event.preventDefault();
    if(values !== null) {
      if(tipo === 'admin') {
        setBanda(values);
      } else {
        navigate('/buscar/' + values.nombre);
      }
    }
    
    
  }

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        const bandas = await getBandas();
        setOptions([...bandas]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      aria-label='autocomplete'
      onChange={handleChange}
      freeSolo={true}
      id="asynchronous-demo"
      sx={{ minWidth:'320px', backgroundColor: 'white', borderRadius: '5px', height: '50px' }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
      getOptionLabel={(option) => option.nombre? option.nombre : "" }
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField aria-label='buscador'
          variant="filled"
          {...params}
          label="Buscar banda..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}