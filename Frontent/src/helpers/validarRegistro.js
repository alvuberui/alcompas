export const validarRegistro = (values) => {
    let error = '';


    const fecha = values.fecha_nacimiento;
    const fecha_entrada = new Date(fecha);
    var diferencia = Date.now() - fecha_entrada;
    var diferencia_fechas = new Date(diferencia); 
    let años = Math.abs(diferencia_fechas.getUTCFullYear() - 1970);
    console.log(años)

    // Comprobamos el nombre 
    if( values.nombre.length < 1)  error = 'El nombre es obligatorio';
    else if( values.nombre.length > 15) error = 'La longitud máxima del nombre es 15 caracteres'
    // Comprobamos los apellidos 
    else if( values.primer_apellido.length < 1)  error = 'El primer apellido es obligatorio';
    else if( values.primer_apellido.length > 15) error = 'La longitud máxima del primer apellido es 15 caracteres'
    else if( values.segundo_apellido.length < 1)  error = 'El segundo apellido es obligatorio';
    else if( values.segundo_apellido.length > 15) error = 'La longitud máxima del segundo apellido es 15 caracteres'
    // Comprobamos el email
    else if (!/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(values.correo)) error = 'El email introducido es incorrecto';
    // Comprobamos la descripción
    else if( values.descripcion.length < 1)  error = 'La descripción es obligatoria';
    else if( values.descripcion.length > 200) error = 'La longitud máxima de la descripción es 200 caracteres'
    // Comprobamos la localidad
    else if( values.localidad.length < 1)  error = 'La localidad es obligatoria';
    else if( values.localidad.length > 15) error = 'La longitud máxima de la localidad es 15 caracteres'
    // Comprobamos la provincia
    else if( values.provincia.length < 1)  error = 'La provincia es obligatoria';
    else if( values.provincia.length > 15) error = 'La longitud máxima de la provincia es 15 caracteres'
    // Comprobamos el código postal
    else if (!/^(?:0?[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(values.codigo_postal)) error = 'El código postal introducido es incorrecto';
    // Comprobamos la dirección
    else if( values.direccion.length < 1)  error = 'La direccion es obligatoria';
    else if( values.direccion.length > 100) error = 'La longitud máxima de la direccion es 30 caracteres';
    // Comprobamos el nif
    else if (!/^[XYZ]?\d{5,8}[A-Z]$/.test(values.nif)) error = 'El nif introducido es incorrecto';
    // Comprobamos el número de teléfono
    else if (!/^\d{9}$/.test(values.telefono)) error = 'El teléfono introducido es a incorrecto';
    // Comprobamos el nombre de usuario
    else if( values.usuario.length < 1)  error = 'El nombre de usuario es obligatorio';
    else if( values.usuario.length > 30) error = 'La longitud máxima del nombre de usuario es 12 caracteres';
    // Comprobamos la contraseña
    else if( values.contraseña.length < 5)  error = 'La contraseña debe de tener al menos 5 caracteres';
    else if( values.contraseña.length > 20) error = 'La longitud máxima de la contraseña es de 20 caracteres';
    else if( values.contraseña != values.confirmacion_contraseña ) error = "La contraseña no coincide con la confirmación de la misma";
    // Comprobamos la fecha de nacimiento
    else if( values.fecha_nacimiento == '') error = "La fecha de nacimiento es obligatoria";
    else if( años < 12 ) error = "Tienes que tener al menos 12 años para poder registrarte";
    
    return error;
}