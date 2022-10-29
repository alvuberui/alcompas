
const validarVoz = (value) => {
    // Manejo de errores
    const voces = ['Primero', 'Segundo', 'Tercero'];
    
    if (voces.includes(value)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
    validarVoz
}