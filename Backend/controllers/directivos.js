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
    try {
        const userId = req.params.userId;
        const bandaId = req.params.bandaId;

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        let condicion = false;

        const ds = await Directivo.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        for (i=0; i<ds.length; i++) {
            let d = ds[i];
            if(d.usuario === payloadId) {
                condicion = true;
            }
        }
        if(!condicion) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }


        const directivo = await Directivo.find({'usuario': userId, 'banda': bandaId, 'fecha_final': undefined});
        
        if(!directivo) {   
            return res.status(404).json({
                ok: false,
                msg: 'No existe un directivo con ese id'
            });
        }
  
        directivo[0].fecha_final = new Date();
        const newDirectivo = new Directivo(directivo[0]);
        const directivoDB = await newDirectivo.save();

        const directivos = await Directivo.find({'banda': bandaId, 'fecha_final': undefined});

        if(directivos.length === 0) {
            await Banda.deleteOne({'_id': bandaId});
        }

        
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

const eliminarDirectivos = async(req, res = express.response) => { 
    const usuarioId = req.params.id;
    try {
        const directivo = await Directivo.deleteMany({'usuario': usuarioId});
        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        let condicion = false;

        const ds = await Directivo.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        for (i=0; i<ds.length; i++) {
            let d = ds[i];
            if(d.usuario === payloadId) {
                condicion = true;
            }
        }
        if(!condicion) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }
        
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

const getDirectivoByBandaId = async(req, res = express.response) => {

    try {
        const bandaId = req.params.id;
        const directivos = await Directivo.find({'banda': bandaId, 'fecha_final': undefined});

        const diccionario = {};
        for(i=0; i<directivos.length; i++) {
            let directivo = directivos[i];
            if(diccionario[directivo.cargo] == undefined) {
                diccionario[directivo.cargo] = [directivo];
            } else {
                diccionario[directivo.cargo] = [...diccionario[musico.cargo], directivo];
            }
        }
        return res.status(201).json({
            ok: true,
            diccionario
        });
    }
    catch (error) {
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
    getDirectivoByUserId,
    getDirectivoByBandaId
}