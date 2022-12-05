export const validarInstrumentos = (value) => {
    // Manejo de errores
    const instrumentos = ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
                            'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
                            'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
                            'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
                            'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
                            'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto'];
    if (instrumentos.includes(value)) {
        return true;
    }
    else {
        return false;
    }
}