
const validarCargo = (value) => {
    // Manejo de errores
    const cargos = ['Presidente', 'Vicepresidente', 'Tesorero', 'Secretario', 'Vocal',
                    'Representante', 'Manager', 'Director', 'Subdirector'];
    
    if (cargos.includes(value)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
    validarCargo
}