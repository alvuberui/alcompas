import dayjs from 'dayjs';

export const validarEvento = (values) => {
    const dias = ['Viernes Dolores', 'Sábado de Pasión', 'Domingo de Resurreción', 'Lunes Santo',
    'Martes Santo', 'Miércoles Santo', 'Jueves Santo', 'Madrugá', 'Viernes Santo', 'Sábado Santo', 'Domingo de Ramos'];
    const tipos = ['Gloria', 'Semana Santa'];
    const fechaHoy = new Date();
    const tipoActuacion = ['Concierto', 'Encuentro de Bandas', 'Corrida de Toros', 'Pasacalles'];
    if( values.tipoEvento === 'procesion') {
        let error = '';
        if( values.titulo.length < 1)  error = '-El título es obligatorio';
        if( values.titulo.length > 50) error = error + ' <br> -La longitud máxima del título es 50 caracteres'
        if( values.descripcion.length > 2000) error = error + ' <br> -La longitud máxima de la descripción es 2000 caracteres'
        if( values.localidad.length < 1)  error = error + ' <br> -La localidad es obligatoria';
        if( values.localidad.length > 20) error = error + ' <br> -La longitud máxima de la localidad es 20 caracteres'
        if( values.provincia.length < 1)  error = error + ' <br> -La provincia es obligatoria';
        if( values.provincia.length > 20) error = error + ' <br> -La longitud máxima de la provincia es 20 caracteres'
        if( values.lugar.length < 1)  error = error + ' <br> -El lugar es obligatorio';
        if( values.lugar.length > 50) error = error + ' <br> -La longitud máxima del lugar es 50 caracteres'
        if( values.costes < 0 ) error = error + ' <br> -Los costes deben ser un número positivo'
        if( values.beneficios < 0 ) error = error + ' <br> -Los beneficios deben ser un número positivo'
        if( !dias.includes(values.dia)) error = error + ' <br> -El día no es válido'
        if( !tipos.includes(values.tipo)) error = error + ' <br> -El tipo no es válido'
        if( values.lugarSalida.length < 1)  error = error + ' <br> -El lugar de salida es obligatorio';
        if( values.lugarSalida.length > 50) error = error + ' <br> -La longitud máxima del lugar de salida es 50 caracteres'
        if( values.bocadillo != true && values.bocadillo != false) error = error + ' <br> -El bocadillo no es válido';
        if( values.hermandad.length < 1)  error = error + ' <br> -La hermandad es obligatoria';
        if( values.hermandad.length > 100) error = error + ' <br> -La longitud máxima de la hermandad es 100 caracteres'
        if( values.nombreTitular.length < 1)  error = error + ' <br> -El nombre del titular es obligatorio';
        if( values.nombreTitular.length > 50) error = error + ' <br> -La longitud máxima del nombre del titular es 50 caracteres';
        if( values.fechaSalida < fechaHoy  ) error = error + ' <br> -La fecha de salida no puede ser anterior a hoy';
        if( values.fechaInicio < values.fechaSalida  ) error = error + ' <br> -La fecha de inicio no puede ser anterior a la de salida';
        if( values.fechaFin < values.fechaInicio) error = error + ' <br> -La fecha de fin no puede ser anterior a la fecha de inicio';
        return error;   
    }
    else if( values.tipoEvento === 'ensayo') {
        let error = '';
        if( values.titulo.length < 1)  error = '-El título es obligatorio';
        if( values.titulo.length > 50) error = error + ' <br> -La longitud máxima del título es 50 caracteres'
        if( values.descripcion.length > 200) error = error + ' <br> -La longitud máxima de la descripción es 2000 caracteres'
        if( values.lugar.length < 1)  error = error + ' <br> -El lugar es obligatorio';
        if( values.lugar.length > 50) error = error + ' <br> -La longitud máxima del lugar es 50 caracteres'
        if( values.fechaFin < values.fechaInicio) error = error + ' <br> -La fecha de fin no puede ser anterior a la fecha de inicio';
        if( values.tematica.length < 1)  error = error + ' <br> -La temática es obligatoria';
        if( values.tematica.length > 200) error = error + ' <br> -La longitud máxima de la temática es 200 caracteres'
        return error;   
    }
    else {
        let error = '';
        if( values.titulo.length < 1)  error = '-El título es obligatorio';
        if( values.titulo.length > 50) error = error + ' <br> -La longitud máxima del título es 50 caracteres'
        if( values.descripcion.length > 200) error = error + ' <br> -La longitud máxima de la descripción es 2000 caracteres'
        if( values.localidad.length < 1)  error = error + ' <br> -La localidad es obligatoria';
        if( values.localidad.length > 20) error = error + ' <br> -La longitud máxima de la localidad es 20 caracteres'
        if( values.provincia.length < 1)  error = error + ' <br> -La provincia es obligatoria';
        if( values.provincia.length > 20) error = error + ' <br> -La longitud máxima de la provincia es 20 caracteres'
        if( values.lugar.length < 1)  error = error + ' <br> -El lugar es obligatorio';
        if( values.lugar.length > 50) error = error + ' <br> -La longitud máxima del lugar es 50 caracteres'
        if( values.costes < 0 ) error = error + ' <br> -Los costes deben ser un número positivo'
        if( values.beneficios < 0 ) error = error + ' <br> -Los beneficios deben ser un número positivo'
        if( values.lugarSalida.length < 1)  error = error + ' <br> -El lugar de salida es obligatorio';
        if( values.lugarSalida.length > 50) error = error + ' <br> -La longitud máxima del lugar de salida es 50 caracteres'
        if( values.fechaSalida < fechaHoy ) error = error + ' <br> -La fecha de salida no puede ser anterior a hoy';
        if( values.fechaInicio < values.fechaSalida ) error = error + ' <br> -La fecha de inicio no puede ser anterior a la de salida';
        if( values.fechaFin < values.fechaInicio) error = error + ' <br> -La fecha de fin no puede ser anterior a la fecha de inicio';
        if( ! tipoActuacion < values.tipoActuacion) error = error + ' <br> -El tipo de actuación no es válido';
        return error;
    }

}