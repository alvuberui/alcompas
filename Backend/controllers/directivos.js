const express = require('express');
const Directivo = require('../models/Directivo');
const Banda = require('../models/Banda');

const crearDirectivo = async(req, res = express.response) => { 
    try {
        const usuarioId = req.uid;
        let nuevo_directivo = new Directivo(req.body);

        // Comprobar si ya tiene un rol de directivo actualmente
        const roles_directivo = await Directivo.find({'usuario': usuarioId});
        
        for (i=0; i < roles_directivo.length; i++) {
            rol = roles_directivo[i];
            if(!rol.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya tiene el rol de directivo'
                });
            }
        }

        // Comrpobamos que la banda tenga sitio para más directivos
        const bandaId = nuevo_directivo.banda;
        const directivos_banda = await Directivo.find({'banda': bandaId});
        const cargo = nuevo_directivo.cargo;

        let vocales_actuales = [];
        let representantes_actuales = [];
        let managers_actuales = [];

        for (i=0; i<directivos_banda.length; i++) {
            let directivo = directivos_banda[i];
            if(cargo == 'Presidente' && directivo.cargo == 'Presidente' && !directivo.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La banda ya tiene un presidente'
                });
            }
            else if(cargo == 'Vicepresidente' && directivo.cargo == 'Vicepresidente' && !directivo.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La banda ya tiene un vicepresidente'
                });
            }
            else if(cargo == 'Tesorero' && directivo.cargo == 'Tesorero' && !directivo.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La banda ya tiene un tesorero'
                });
            }
            else if(cargo == 'Secretario' && directivo.cargo == 'Secretario' && !directivo.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La banda ya tiene un secretario'
                });
            }
            else if(cargo == 'Director' && directivo.cargo == 'Director' && !directivo.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La banda ya tiene un director'
                });
            }
            else if(cargo == 'Subdirector' && directivo.cargo == 'Subdirector' && !directivo.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La banda ya tiene un subdirector'
                });
            }
            else if(cargo == 'Vocal' && directivo.cargo == 'Vocal' && !directivo.fecha_final) {
                vocales_actuales.push(directivo);
            }
            else if(cargo == 'Representante' && directivo.cargo == 'Representante' && !directivo.fecha_final) {
                representantes_actuales.push(directivo);
            }
            else if(cargo == 'Manager' && directivo.cargo == 'Manager' && !directivo.fecha_final) {
                managers_actuales.push(directivo);
            }
        }
        if(vocales_actuales.length >= 5) {
            return res.status(400).json({
                ok: false,
                msg: 'La banda ya tiene el número máximo de vocales'
            });
        }
        if(managers_actuales.length >= 3) {
            return res.status(400).json({
                ok: false,
                msg: 'La banda ya tiene el número máximo de community managers'
            });
        }
        if(representantes_actuales.length >= 3) {
            return res.status(400).json({
                ok: false,
                msg: 'La banda ya tiene el número máximo de representantes'
            });
        }
        
        // Se crea correctamente 
        nuevo_directivo.usuario = req.uid;
        const directivoDB = await nuevo_directivo.save();

        res.status(201).json({
            ok: true,
            directivoDB,
        });


        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const finalizarDirectivo = async(req, res = express.response) => { 
    const directivoId = req.params.id;
    try {
        let directivo_antiguo = await Directivo.findById(directivoId);
        const bandaId = directivo_antiguo.banda;
        const roles_directivos = await Directivo.find({'banda': bandaId});
        const directivos_actuales = [];

        for(i=0; i < roles_directivos.length; i++) {
            let rol = roles_directivos[i];
            if(!rol.fecha_final) {
                directivos_actuales.push(rol);
            }
        }

        if(directivos_actuales.length <= 1) {
            const banda = Banda.findById(bandaId);
            await Banda.deleteOne(banda);
        }
        directivo_antiguo.fecha_final = new Date();
        const directivo_finalizado = await directivo_antiguo.save();
       
        return res.status(201).json({
            ok: true,
            directivo_finalizado
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });

    }
}

const eliminarDirectivos = async(req, res = express.response) => { 
    const usuarioId = req.params.id;
    try {
        const directivo = await Directivo.deleteMany({'usuario': usuarioId});
        
        
        return res.status(201).json({
            ok: true,
            directivo
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getDirectivoById = async(req, res = express.response) => { 
    try {
        const directivoId = req.params.id;
        const directivo = await Directivo.findById(directivoId);

        res.status(201).json({
            ok: true,
            directivo
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getDirectivoByUserId = async(req, res = express.response) => {
    try {
        const usuarioId = req.params.id;
        const directivo = await Directivo.find({'usuario': usuarioId});

        res.status(201).json({
            ok: true,
            directivo
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}



module.exports = {
    crearDirectivo,
    finalizarDirectivo,
    eliminarDirectivos,
    getDirectivoById,
    getDirectivoByUserId
}