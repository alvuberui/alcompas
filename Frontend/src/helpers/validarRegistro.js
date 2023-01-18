export const validarRegistro = (values) => {
    let error = '';


    const fecha = values.fecha_nacimiento;
    const fecha_entrada = new Date(fecha);
    var diferencia = Date.now() - fecha_entrada;
    var diferencia_fechas = new Date(diferencia); 
    let años = Math.abs(diferencia_fechas.getUTCFullYear() - 1970);



    // Comprobamos el nombre 
    if( values.nombre.length < 1)  error = 'El nombre es obligatorio';
    if( values.nombre.length > 150) error =  error + '<br> La longitud máxima del nombre es 150 caracteres'
    // Comprobamos los apellidos 
    if( values.primer_apellido.length < 1)  error = error + '<br> El primer apellido es obligatorio';
    if( values.primer_apellido.length > 150) error = error + '<br> La longitud máxima del primer apellido es 150 caracteres'
    if( values.segundo_apellido.length < 1)  error = error + '<br> El segundo apellido es obligatorio';
    if( values.segundo_apellido.length > 150) error = error + '<br> La longitud máxima del segundo apellido es 150 caracteres'
    // Comprobamos el email
    if( values.correo.length > 150) error = error + '<br> La longitud máxima del email es de 150 caracteres'
    if( values.correo.length < 5) error = error + '<br> El email no es correcto'
    if (!/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(values.correo)) error = error + '<br> El email introducido es incorrecto';
    // Comprobamos la descripción
    if( values.descripcion.length < 1)  error = error + '<br> La descripción es obligatoria';
    if( values.descripcion.length > 500) error = error + '<br> La longitud máxima de la descripción es 500 caracteres'
    // Comprobamos la localidad
    if( values.localidad.length < 1)  error = error + '<br> La localidad es obligatoria';
    if( values.localidad.length > 50) error = error + '<br> La longitud máxima de la localidad es 50 caracteres'
    // Comprobamos la provincia
    if( values.provincia.length < 1)  error = error + '<br> La provincia es obligatoria';
    if( values.provincia.length > 50) error = error + '<br> La longitud máxima de la provincia es 50 caracteres'
    // Comprobamos el código postal
    if (!/^(?:0?[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(values.codigo_postal)) error = error + '<br> El código postal introducido es incorrecto';
    // Comprobamos la dirección
    if( values.direccion.length < 1)  error = error + '<br> La direccion es obligatoria';
    if( values.direccion.length > 150) error = error + '<br> La longitud máxima de la direccion es 150 caracteres';
    // Comprobamos el nif
    if (!/^[XYZ]?\d{5,8}[A-Z]$/.test(values.nif)) error = error + '<br> El nif introducido es incorrecto';
    // Comprobamos el número de teléfono
    if (!/^\d{9}$/.test(values.telefono)) error = error + '<br> El teléfono introducido es a incorrecto';
    // Comprobamos el nombre de usuario
    if( values.usuario.length < 1)  error = error + '<br> El nombre de usuario es obligatorio';
    if( values.usuario.length > 20) error = error + '<br> La longitud máxima del nombre de usuario es 12 caracteres';
    // Comprobamos la contraseña
    
    if( values.contraseña.length < 8)  error = error + '<br> La contraseña debe de tener al menos 7 caracteres';
    if( values.contraseña.length > 200) error = error + '<br> La longitud máxima de la contraseña es de 200 caracteres';
    if( values.contraseña != values.confirmacion_contraseña ) error = error + "<br> La contraseña no coincide con la confirmación de la misma";
    // Comprobamos la fecha de nacimiento
    if( values.fecha_nacimiento == '') error = error + "<br> La fecha de nacimiento es obligatoria";
    if( años < 12 ) error = error + "<br> Tienes que tener al menos 12 años para poder registrarte";

    return error;
}

