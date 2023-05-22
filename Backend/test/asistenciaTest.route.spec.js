const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de asistencias", () => {

    const newBanda = {
        "nombre": "TestBanda",
        "tipo": "Agrupación Musical",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "año_fundacion": 1999,
        "descripcion": "TestBanda",
        "telefono": 111222333,
        "correo": "testbanda@gmail.com",
        "cif": "G01536622",
    }

    const newUser = {
        "nombre": "TestBanda",
        "primer_apellido": "TestBanda",
        "segundo_apellido": "TestBanda",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testbanda@test.com",
        "descripcion": "TestBanda",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "nif": "96491178Z",
        "telefono": 111222333,
        "usuario": "TestBanda",
        "contraseña": "asdf1234"
    }

    const newUser2 = {
        "nombre": "TestBanda",
        "primer_apellido": "TestBanda",
        "segundo_apellido": "TestBanda",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testbanda2@test.com",
        "descripcion": "TestBanda",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "nif": "37233792N",
        "telefono": 111222334,
        "usuario": "TestBanda2",
        "contraseña": "asdf1234"
    }

    const concierto = {
        "titulo": "Concierto de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": new Date("2025/01/30 15:30:10.999"),
        "fechaFin": new Date("2025/01/30 16:30:10.999"),
        "localidad": "Localidad de prueba",
        "provincia": "Provincia de prueba",
        "lugar": "Lugar de prueba",
        "tipoActuacion": "Concierto",
        "fechaSalida": new Date("2025/01/30 13:30:10.999"),
        "lugarSalida": "Lugar de salida de prueba",
        "beneficios": 100,
        "costes": 100,
        "comentarioEconomico": "Comentario económico de prueba",
    }

    const ensayo = {
        "titulo": "Ensayo de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": new Date("2025/01/30 15:30:10.999"),
        "fechaFin": new Date("2025/01/30 16:30:10.999"),
        "lugar": "Lugar de prueba",
        "tematica": "Tematica de prueba",
    }

    const procesion = {
        "titulo": "Procesión de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": new Date("2025/01/30 15:30:10.999"),
        "fechaFin": new Date("2025/01/30 16:30:10.999"),
        "localidad": "Localidad de prueba",
        "provincia": "Provincia de prueba",
        "lugar": "Lugar de prueba",
        "costes": 100,
        "beneficios": 100,
        "comentarioEconomico": "Comentario económico de prueba",
        "dia": "Viernes Dolores",
        "tipo": "Gloria",
        "fechaSalida": new Date("2025/01/30 13:30:10.999"),
        "lugarSalida": "Lugar de salida de prueba",
        "hermandad": "Hermandades de prueba",
        "nombreTitular": "Nombre de titular de prueba",
        "bocadillo": true,
    }

    const asistencia = {
        "respuesta": "Asisto",
        "tipo": "Procesion",
        "comentario": "Comentario de prueba",
    }

    describe("Casos positivos de la api de asistencias", () => {
        let token = "";
        let uid = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";
        let asistenciaId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
            procesion.banda = bandaId;
            concierto.banda = bandaId;
            ensayo.banda = bandaId;
            const responseProcesion = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            procesionId = responseProcesion.body.procesionDB._id;
            procesion.transaccion = responseProcesion.body.procesionDB.transaccion;
            const responseConcierto = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            actuacionId = responseConcierto.body.actuacionDB._id;
            concierto.transaccion = responseConcierto.body.actuacionDB.transaccion;
            const responseEnsayo = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            ensayoId = responseEnsayo.body.ensayoDB._id;
        });

        test("Crear asistencia a procesión", async () => {
            asistencia.referencia = procesionId;
            asistencia.usuario = uid;
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);
            expect(response.statusCode).toBe(201);
            expect(response.body.asistenciaDB.respuesta).toBe(asistencia.respuesta);
        });

        test("Crear asistencia a actuación", async () => {
            asistencia.referencia = actuacionId;
            asistencia.usuario = uid;
            asistencia.tipo = "Actuacion";
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);
            expect(response.statusCode).toBe(201);
            expect(response.body.asistenciaDB.respuesta).toBe(asistencia.respuesta);
        });

        test("Crear asistencia a ensayo", async () => {
            asistencia.referencia = ensayoId;
            asistencia.usuario = uid;
            asistencia.tipo = "Ensayo";
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);
            expect(response.statusCode).toBe(201);
            expect(response.body.asistenciaDB.respuesta).toBe(asistencia.respuesta);
            asistenciaId = response.body.asistenciaDB._id;
        });

        test("Actualizar asistencia", async () => {
            asistencia.respuesta = "No asisto";
            asistencia._id = asistenciaId;
            const response = await request(app).put('/api/asistencias/' + asistencia.referencia).send(asistencia).set('x-token', token);
            expect(response.statusCode).toBe(201);
        });

        test("Obtener asistencias de un usuario a un evento", async () => {
            const response = await request(app).get('/api/asistencias/evento/' + ensayoId + '/tipo/Ensayo').set('x-token', token);
            expect(response.statusCode).toBe(200);

            const response1 = await request(app).get('/api/asistencias/evento/' + actuacionId + '/tipo/Actuacion').set('x-token', token);
            expect(response1.statusCode).toBe(200);

            const response2 = await request(app).get('/api/asistencias/evento/' + procesionId + '/tipo/Procesion').set('x-token', token);
            expect(response2.statusCode).toBe(200);
        });

        test("Obtener asistencia de un usuario a un evento", async () => {
            const response = await request(app).get('/api/asistencias/usuario/' + uid + '/evento/' + ensayoId + '/tipo/Ensayo').set('x-token', token);
            expect(response.statusCode).toBe(200);

            const response1 = await request(app).get('/api/asistencias/usuario/' + uid + '/evento/' + actuacionId + '/tipo/Actuacion').set('x-token', token);
            expect(response1.statusCode).toBe(200);

            const response2 = await request(app).get('/api/asistencias/usuario/' + uid + '/evento/' + procesionId + '/tipo/Procesion').set('x-token', token);
            expect(response2.statusCode).toBe(200);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });

    describe("Casos negativos de la api de asistencias", () => {

        let token = "";
        let uid = "";
        let bandaId = "";
        let uid2 = "";
        let token2 = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";
        let asistenciaId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            const loginResponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token2 = loginResponse2.body.token;
            uid2 = loginResponse2.body.uid;
            uid = loginReponse.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
            procesion.banda = bandaId;
            concierto.banda = bandaId;
            ensayo.banda = bandaId;
            const responseProcesion = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            procesionId = responseProcesion.body.procesionDB._id;
            procesion.transaccion = responseProcesion.body.procesionDB.transaccion;
            const responseConcierto = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            actuacionId = responseConcierto.body.actuacionDB._id;
            concierto.transaccion = responseConcierto.body.actuacionDB.transaccion;
            const responseEnsayo = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            ensayoId = responseEnsayo.body.ensayoDB._id;
        });

        test("Crear asistencia a procesión sin pertenecer a la banda", async () => {
            asistencia.referencia = procesionId;
            asistencia.usuario = uid2;
            asistencia.tipo = "Procesion";
      
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token2);
            expect(response.statusCode).toBe(401);
        });

        test("Actualizar asistencia sin pertenecer a la banda", async () => {
            asistencia.referencia = procesionId;
            asistencia.usuario = uid;
            asistencia.tipo = "Procesion";
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);

            asistencia.respuesta = "No asisto";
            asistencia._id = response.body.asistenciaDB._id;
            const response1 = await request(app).put('/api/asistencias/' + asistencia.referencia).send(asistencia).set('x-token', token2);
            expect(response1.statusCode).toBe(401);
        });

        test("Obtener asistencia de un usuario a un evento sin ser directivo", async () => {

            const response2 = await request(app).get('/api/asistencias/usuario/' + uid + '/evento/' + procesionId + '/tipo/Procesion').set('x-token', token2);
            expect(response2.statusCode).toBe(401);
        });

        test("Crear asistencia con valores invalidos", async () => {
            asistencia.referencia = procesionId;
            asistencia.usuario = uid;
            asistencia.tipo = "dasdas";
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);
            expect(response.statusCode).toBe(400);

            asistencia.referencia = procesionId;
            asistencia.usuario = uid;
            asistencia.tipo = "dasdas";
            asistencia.respuesta = "dasdas";
            const response2 = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });

        test("Actualizar asistencia con valores invalidos", async () => {
            asistencia.referencia = procesionId;
            asistencia.usuario = uid;
            asistencia.tipo = "Procesion";
            asistencia.respuesta = "fwefwefwe";
            const response = await request(app).post('/api/asistencias').send(asistencia).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });





        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });

    });
});