import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useBandasStore } from '../hooks/useBandasStore';
import { useNavigate } from 'react-router-dom';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export  function Buscador() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const { getBandas } = useBandasStore();
  let navigate = useNavigate();

  const handleChange = (event) => {
    event.preventDefault();
    if(typeof event.target.value === 'number') {
      const parametro = options[event.target.value];
      navigate('/buscar/' + parametro.nombre);
      window.location.reload(false);
    }
    else {
      navigate('/buscar/' + event.target.value);
      window.location.reload(false);
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
        <TextField
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