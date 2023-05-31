const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de contratados", () => {

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

    const contratado = {
        "tipo": "Procesion",
        "instrumento": "Corneta",
    }

    describe("Casos positivos de la api de contratados", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";
        let asistenciaId = "";
        let contratado1Id = "";
        let contratado2Id = "";
        let contratado3Id = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token2 = loginReponse2.body.token;
            uid2 = loginReponse2.body.uid;
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

        test("Crear contratado", async () => {
            contratado.referencia = procesionId;
            contratado.usuario = uid2;
            const response = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.contratadoDB).toHaveProperty("_id");
            contratado1Id = response.body.contratadoDB._id;

            contratado.referencia = actuacionId;
            contratado.usuario = uid2;
            contratado.tipo = "Actuacion";
            const response2 = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.ok).toBe(true);
            expect(response2.body.contratadoDB).toHaveProperty("_id");
            contratado2Id = response2.body.contratadoDB._id;

            contratado.referencia = ensayoId;
            contratado.usuario = uid2;
            contratado.tipo = "Ensayo";
            const response3 = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response3.statusCode).toBe(200);
            expect(response3.body.ok).toBe(true);
            expect(response3.body.contratadoDB).toHaveProperty("_id");
            contratado3Id = response3.body.contratadoDB._id;
        });

        test("Listar contratados", async () => {
            const response = await request(app).get('/api/contratados/evento/Procesion/' + procesionId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);

            const response2 = await request(app).get('/api/contratados/evento/Actuacion/' + actuacionId).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.ok).toBe(true);

            const response3 = await request(app).get('/api/contratados/evento/Ensayo/' + ensayoId).set('x-token', token);
            expect(response3.statusCode).toBe(200);
            expect(response3.body.ok).toBe(true);
        });

        test("Eliminar contratado", async () => {
            const response = await request(app).delete('/api/contratados/' + contratado1Id).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);

            const response2 = await request(app).delete('/api/contratados/' + contratado2Id).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.ok).toBe(true);

            const response3 = await request(app).delete('/api/contratados/' + contratado3Id).set('x-token', token);
            expect(response3.statusCode).toBe(200);
            expect(response3.body.ok).toBe(true);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });

    describe("Casos negativos de la api de contratados", () => {

        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";
        let asistenciaId = "";
        let contratado1Id = "";
        let contratado2Id = "";
        let contratado3Id = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token2 = loginReponse2.body.token;
            uid2 = loginReponse2.body.uid;
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

        test("Crear contratado sin ser directivo", async () => {
            contratado.referencia = procesionId;
            contratado.usuario = uid2;
            contratado.tipo = "Procesion";
            const response = await request(app).post('/api/contratados').send(contratado).set('x-token', token2);
            expect(response.statusCode).toBe(401);
            expect(response.body.ok).toBe(false);
            expect(response.body.msg).toBe("No tiene permisos para crear esta transacción");
        });

        test("Crear contratado con un usuario que ya esta contratado", async () => {
            contratado.referencia = procesionId;
            contratado.usuario = uid2;
            const response = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.contratadoDB).toHaveProperty("_id");
            contratado1Id = response.body.contratadoDB._id;

            const response2 = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });

        test("Listar contratados sin ser directivo", async () => {
            const response = await request(app).get('/api/contratados/evento/Procesion/' + procesionId).set('x-token', token2);
            expect(response.statusCode).toBe(401);
        });

        test("Eliminar contratado sin ser directivo", async () => {
            const response = await request(app).delete('/api/contratados/' + contratado1Id).set('x-token', token2);
            expect(response.statusCode).toBe(401);
        });

        test("Crear contratado con valores incorrectos", async () => {
            contratado.referencia = procesionId;
            contratado.usuario = uid2;
            contratado.tipo = "Procesion";
            contratado.instrumento = "Test";
            const response = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response.statusCode).toBe(400);
            expect(response.body.ok).toBe(false);


            contratado.instrumento = "Corneta";
            contratado.tipo = "Test";
            const response2 = await request(app).post('/api/contratados').send(contratado).set('x-token', token);
            expect(response2.statusCode).toBe(400);
            expect(response2.body.ok).toBe(false);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });

        


    });
});