export const validarBanda = (values) => {
    let error = '';

    // Comprobamos el nombre 
    if( values.nombre.length < 1)  error = '-El nombre es obligatorio';
    if( values.nombre.length > 50) error = error + ' <br> -La longitud máxima del nombre es 50 caracteres'
    // Comprobamos tipo de banda
    const condicion_a = values.tipo == 'Agrupación Musical';
    const condicion_b = values.tipo == 'Banda de Cornetas y Tambores';
    const condicion_c = values.tipo == 'Banda de Música';
    if( condicion_a == false && condicion_b == false && condicion_c == false )  error = error + ' <br> -El tipo de banda es incorrecto';
    if( values.correo.length > 150) error = error + ' <br> -La longitud máxima del email es 150 caracteres'
    // Comprobamos el correo electrónico
    if (!/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(values.correo)) error = error + ' <br> -El email introducido es incorrecto';
    // Comprobamos la descripción
    if( values.descripcion.length < 1)  error = error + ' <br> -La descripción es obligatoria';
    if( values.descripcion.length > 500) error = error + ' <br> -La longitud máxima de la descripción es 500 caracteres'
    // Comprobamos la localidad
    if( values.localidad.length < 1)  error = error + ' <br> -La localidad es obligatoria';
    if( values.localidad.length > 50) error = error + ' <br> -La longitud máxima de la localidad es 50 caracteres'
    // Comprobamos la provincia
    if( values.provincia.length < 1)  error = error + ' <br> -La provincia es obligatoria';
    if( values.provincia.length > 50) error = error + ' <br> -La longitud máxima de la provincia es 50 caracteres'
    // Comprobamos el código postal
    if (!/^(?:0?[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(values.codigo_postal)) error = error + ' \n -El código postal introducido es incorrecto';
    // Comprobamos la dirección
    if( values.direccion.length < 1)  error = error + ' <br> -La direccion es obligatoria';
    if( values.direccion.length > 150) error = error + ' <br> -La longitud máxima de la direccion es 150 caracteres';
    // Comprobamos el nif
    const value = values.cif
    const primer_valor = value[0];
    const cadena = value.replace(primer_valor, '');
    const longitud = value.length;
    let solo_letras = /^\d+$/.test(cadena);
    if(longitud != 9 || !solo_letras) error = error + ' <br> -El NIF introducido es incorrecto';
    // Comprobamos el número de teléfono
    if (!/^\d{9}$/.test(values.telefono)) error = error + ' <br> -El teléfono introducido es a incorrecto';
    // Comprobamos el año de fundación
    const fechaActual = new Date();
    const fechaActualYear = fechaActual.getFullYear();
    if( values.año_fundación > fechaActualYear) error = error + ' <br> -El año de fundación no puede ser mayor que el año actual';
    if( values.año_fundación < 1500) error = error + ' <br> -El año de fundación es incorrecto';
    return error;
}