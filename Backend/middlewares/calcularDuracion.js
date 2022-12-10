const calcularDuracionEnDias = (f1,f2) => {
    const days = Math.floor((f2 - f1) / (1000 * 60 * 60 * 24));
    return days;
}

module.exports = {
    calcularDuracionEnDias
}