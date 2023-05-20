const express = require("express");
const Usuario = require("../models/Usuario");
const Comentario = require("../models/Comentario");
const Instrumento = require("../models/Instrumento");
const Musico = require("../models/Musico");
const Archivero = require("../models/Archivero");
const Directivo = require("../models/Directivo");
const Estudio = require("../models/Estudio");
const Peticion = require("../models/Peticion");
const Banda = require("../models/Banda");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");
const Like = require("../models/Like");

/*
 * En primer lugar se comprueba si existe ya un usuario con ese correo, nif o telefon, en caso de que no se
 * encripta la contraseña y se envía a base de datos, generando su json web token (JWT).
 */
const crearUsuario = async (req, res = express.response) => {
  const { correo, nif, telefono, usuario, contraseña } = req.body;

  try {
    let nuevo_usuario = await Usuario.findOne({ correo });

    if (nuevo_usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo",
      });
    }

    nuevo_usuario = await Usuario.findOne({ nif });

    if (nuevo_usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese nif",
      });
    }

    nuevo_usuario = await Usuario.findOne({ telefono });
    if (nuevo_usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese teléfono",
      });
    }
    nuevo_usuario = await Usuario.findOne({ usuario });
    if (nuevo_usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese nombre de usuario",
      });
    }

    nuevo_usuario = new Usuario(req.body);
    nuevo_usuario.administrador = false;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    nuevo_usuario.contraseña = bcrypt.hashSync(contraseña, salt);
    await nuevo_usuario.save();

    // Generar JWT
    const token = await generarJWT(nuevo_usuario.id, nuevo_usuario.nombre);

    res.status(201).json({
      ok: true,
      msg: "registro",
      uid: nuevo_usuario.id,
      nombre: nuevo_usuario.nombre,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

/*
 * Modifica los datos de un usuario
 */
const cambiarDatos = async (req, res = express.response) => {
  try {
    const { nif, telefono, usuario, correo } = req.body;
    const id = req.params.id;

    // Comprobar que el usuario de la petición es el mismo
    const t = req.header("x-token");
    const payload = jwt.verify(t, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (payloadId !== id) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para editar este usuario",
      });
    }

    let nuevo_usuario = await Usuario.findOne({ correo });
    if (nuevo_usuario && nuevo_usuario.id != id) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo",
      });
    }

    nuevo_usuario = await Usuario.findOne({ nif });
    if (nuevo_usuario && nuevo_usuario.id != id) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese nif",
      });
    }

    nuevo_usuario = await Usuario.findOne({ telefono });
    if (nuevo_usuario && nuevo_usuario.id != id) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese teléfono",
      });
    }
    nuevo_usuario = await Usuario.findOne({ usuario });
    if (nuevo_usuario && nuevo_usuario.id != id) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese nombre de usuario",
      });
    }

    const antiguo_usuario = await Usuario.findById(id);

    nuevo_usuario = new Usuario(req.body);
    nuevo_usuario.contraseña = antiguo_usuario.contraseña;
    nuevo_usuario._id = antiguo_usuario._id;

    const actualizado = await Usuario.findByIdAndUpdate(id, nuevo_usuario, {
      new: true,
    });

    // Generar JWT
    const token = await generarJWT(actualizado.id, actualizado.nombre);

    res.status(201).json({
      ok: true,
      msg: "actualizado datos de usuario",
      uid: actualizado._id,
      nombre: actualizado.nombre,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

/*
 * Modifica la contraseña de un usuario
 */
const modificarContraseña = async (req, res = express.response) => {
  // Comprobar que la contraseña actual es cierta
  try {
    const values = req.body;
    const userId = req.params.id;

    // Comprobar que el usuario de la petición es el mismo
    const t = req.header("x-token");
    const payload = jwt.verify(t, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (payloadId !== userId) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para editar este usuario",
      });
    }

    const salt = bcrypt.genSaltSync();
    let usuario = await Usuario.findById(userId);
    // Encriptar contraseña
    const contraseñaNuevaEncriptada = bcrypt.hashSync(
      values.contraseñaNueva,
      salt
    );

    usuario.contraseña = contraseñaNuevaEncriptada;
    usuarioModificado = await Usuario.findByIdAndUpdate(userId, usuario, {
      new: true,
    });
    // Generar JWT
    await generarJWT(usuarioModificado.id, usuarioModificado.nombre);
    res.status(201).json({
      ok: true,
      msg: "actualizado datos de usuario",
      usuarioModificado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

/*
 * Comprueba que el usuario existe y que la contraseña es correcta, en caso de que lo sea
 * genera un json web token (JWT) y lo envía al cliente.
 * En caso de que no sea correcta la contraseña o el email, se envía un mensaje de error.
 *   */
const loginUsuario = async (req, res = express.response) => {
  const { correo, contraseña } = req.body;
  try {
    const nuevo_usuario = await Usuario.findOne({ correo });
    if (!nuevo_usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Email incorrecto",
      });
    }
    const contraseña_valida = bcrypt.compareSync(
      contraseña,
      nuevo_usuario.contraseña
    );
    if (!contraseña_valida) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    // Generar JWT
    const token = await generarJWT(nuevo_usuario.id, nuevo_usuario.nombre);

    res.status(200).json({
      ok: true,
      uid: nuevo_usuario.id,
      nombre: nuevo_usuario.nombre,
      token,
    });
  } catch {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
 * Revalida el token de un usuario
 */
const revalidarToken = async (req, res = express.response) => {
  const uid = req.uid;
  const nombre = req.nombre;
  const usuario = await Usuario.findById(uid);

  // Comprobar que el usuario de la petición es el mismo
  const t = req.header("x-token");
  const payload = jwt.verify(t, process.env.SECRET_JWT_SEED);
  const payloadId = payload.uid;

  if (payloadId !== uid) {
    return res.status(401).json({
      ok: false,
      msg: "No tiene privilegios para revalidar el token",
    });
  }

  // Generar JWT
  const token = await generarJWT(uid, nombre);

  res.json({
    ok: true,
    uid: uid,
    nombre: usuario.nombre,
    token: token,
  });
};

/*
 * Obtiene un usuario por su id
 */
const getById = async (req, res = express.response) => {
  try {
    const uid = req.params.id;
    const usuario = await Usuario.findById(uid);

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
 * Elimina a un usuairo por su id. También elimina todos sus roles, comentarios,
 * likes, estudios y instrumentos.
 */
const deleteById = async (req, res = express.response) => {
  try {
    const uid = req.params.id;

    // Comprobar que el usuario de la petición es el mismo
    const t = req.header("x-token");
    const payload = jwt.verify(t, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (payloadId !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para eliminar el usuario",
      });
    }

    await Comentario.deleteMany({ usuario: uid });
    await Musico.deleteMany({ usuario: uid });
    await Directivo.deleteMany({ usuario: uid });
    await Archivero.deleteMany({ usuario: uid });
    await Estudio.deleteMany({ usuario: uid });
    await Instrumento.deleteMany({ usuario: uid });
    await Like.deleteMany({ usuario: uid });

    const peticiones = await Peticion.find({ usuario: uid });

    // Elimina solo aquellas peticiones en la que la banda haya sido eliminada
    for (let i = 0; i < peticiones.length; i++) {
      const p = peticiones[i];
      const b = p.banda;
      const banda = await Banda.findById(b);

      if (!banda) await Peticion.findByIdAndDelete(p._id);
    }

    const usuario = await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
 * Función para que el administrador elimine a un usuario
 */
const deleteAdminById = async (req, res = express.response) => {
  try {
    const uid = req.params.id;

    // Comprobar que el usuario de la petición es el mismo
    const t = req.header("x-token");
    const payload = jwt.verify(t, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const u = await Usuario.findById(payloadId);
    if (u.administrador !== true) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para eliminar el usuario",
      });
    }

    await Comentario.deleteMany({ usuario: uid });
    await Musico.deleteMany({ usuario: uid });
    await Directivo.deleteMany({ usuario: uid });
    await Archivero.deleteMany({ usuario: uid });
    await Estudio.deleteMany({ usuario: uid });
    await Instrumento.deleteMany({ usuario: uid });
    await Like.deleteMany({ usuario: uid });

    const peticiones = await Peticion.find({ usuario: uid });

    // Elimina solo aquellas peticiones en la que la banda haya sido eliminada
    for (let i = 0; i < peticiones.length; i++) {
      const p = peticiones[i];
      const b = p.banda;
      const banda = await Banda.findById(b);
      if (!banda) await Peticion.findByIdAndDelete(p._id);
    }

    const usuario = await Usuario.findByIdAndDelete(uid);
    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
 * Obtiene todos los usuarios
 */
const getAll = async (req, res = express.response) => {
  try {
    const usuarios = await Usuario.find();
    res.json({
      ok: true,
      usuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
 * Obtiene un usuario por su nombre de usuario
 */
const getByUsername = async (req, res = express.response) => {
  try {
    const username = req.params.username;
    const usuario = await Usuario.find({ usuario: username });
    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
 * Obtiene todas las localidades de los usuarios
 */
const obtenerTodasLocalidades = async (req, res = express.response) => {
  try {
    const usuarios = await Usuario.find();
    const localidades = [];

    for (let i = 0; i < usuarios.length; i++) {
      const u = usuarios[i];
      if (!localidades.includes(u.localidad)) localidades.push(u.localidad);
    }
    res.json({
      ok: true,
      localidades,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  getById,
  cambiarDatos,
  modificarContraseña,
  deleteById,
  getAll,
  getByUsername,
  deleteAdminById,
  obtenerTodasLocalidades,
};
