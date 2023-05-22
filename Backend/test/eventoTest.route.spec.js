const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de eventos", () => {

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

    describe("Casos positivos de la api de eventos", () => {
        let token = "";
        let uid = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
        });

        test("Crear procesión", async() => {
            procesion.banda = bandaId;
            const response = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.procesionDB).toHaveProperty('titulo');
            procesionId = response.body.procesionDB._id;
            procesion.transaccion = response.body.procesionDB.transaccion;
        });

        test("Crear procesión cantidad negativa", async() => {
            procesion.banda = bandaId;
            procesion.costes = -10000;
            const response = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.procesionDB).toHaveProperty('titulo');
        });

        test("Crear actuación", async() => {
            concierto.banda = bandaId;
            const response = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.actuacionDB).toHaveProperty('titulo');
            actuacionId = response.body.actuacionDB._id;
            concierto.transaccion = response.body.actuacionDB.transaccion;
        });


        test("Crear ensayo", async() => {
            ensayo.banda = bandaId;
            const response = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ensayoDB).toHaveProperty('titulo');
            ensayoId = response.body.ensayoDB._id;
        });

        test("Actualizar procesion", async() => {
            procesion.titulo = "Procesión de prueba actualizada";
            procesion._id = procesionId;
            procesion.banda = bandaId;
            const response = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.procesionDB.titulo).toBe('Procesión de prueba actualizada');
        });

        test("Actualizar actuación", async() => {
            concierto.titulo = "Concierto de prueba actualizado";
            concierto._id = actuacionId;
            concierto.banda = bandaId;
            const response = await request(app).put('/api/eventos/actuacion/' + actuacionId).send(concierto).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.actuacionDB.titulo).toBe('Concierto de prueba actualizado');
        });

        test("Actualizar ensayo", async() => {
            ensayo.titulo = "Ensayo de prueba actualizado";
            ensayo._id = ensayoId;
            ensayo.banda = bandaId;
            const response = await request(app).put('/api/eventos/ensayo/' + ensayoId).send(ensayo).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ensayoDB.titulo).toBe('Ensayo de prueba actualizado');
        });

        test("Obtener eventos por su fecha", async() => {
            const response = await request(app).post('/api/eventos/banda/fecha').set('x-token', token).send({"fecha": "2025-01-30", "banda": bandaId});
            expect(response.statusCode).toBe(200);
            expect(response.body.eventos).toHaveLength(4);
        });

        test("Obtener eventos destacados", async() => {
            const respuestaLike = await request(app).post('/api/likes').set('x-token', token).send({"tipo": "Procesion", "referencia": procesionId, "usuario": uid});
            const response = await request(app).post('/api/eventos/destacados/fecha').set('x-token', token).send({"fecha": "2025-01-30"});
            expect(response.statusCode).toBe(200);
            expect(response.body.eventos).toHaveLength(3);
            expect(response.body.eventos[0].titulo).toBe('Procesión de prueba actualizada');
        });

        test("Obtener eventos por tipo e id", async() => {
            const response = await request(app).get('/api/eventos/Procesión/id/' + procesionId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.evento.titulo).toBe('Procesión de prueba actualizada');

            const response2 = await request(app).get('/api/eventos/Actuación/id/' + actuacionId).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.evento.titulo).toBe('Concierto de prueba actualizado');

            const response3 = await request(app).get('/api/eventos/Ensayo/id/' + ensayoId).set('x-token', token);
            expect(response3.statusCode).toBe(200);
            expect(response3.body.evento.titulo).toBe('Ensayo de prueba actualizado');
        });

        test("Eliminar eventos", async() => {
            const response = await request(app).delete('/api/eventos/Procesión/id/' + procesionId).set('x-token', token);
            expect(response.statusCode).toBe(200);

            const response2 = await request(app).delete('/api/eventos/Actuación/id/' + actuacionId).set('x-token', token);
            expect(response2.statusCode).toBe(200);

            const response3 = await request(app).delete('/api/eventos/Ensayo/id/' + ensayoId).set('x-token', token);
            expect(response3.statusCode).toBe(200);
        });

        

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });


    describe("Casos negativos de la api de eventos", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId = "";
        let procesionId = "";
        let actuacionId = "";
        let ensayoId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse  = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            token2 = loginReponse2.body.token;
            uid2 = loginReponse2.body.uid;
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;
        });

        test("Crear procesión sin token de directivo", async() => {
            procesion.banda = bandaId;
            const response = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Crear procesion con fecha invalida", async() => {
            procesion.banda = bandaId;
            procesion.fechaInicio = new Date("2025/01/30 15:30:10.999");
            procesion.fechaFin = new Date("2025/01/30 14:30:10.999");
            const response = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear actuación con fecha invalida", async() => {
            concierto.banda = bandaId;
            concierto.fechaInicio = new Date("2025/01/30 15:30:10.999");
            concierto.fechaFin = new Date("2025/01/30 14:30:10.999");
            const response = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear ensayo con fecha invalida", async() => {
            ensayo.banda = bandaId;
            ensayo.fechaInicio = new Date("2025/01/30 15:30:10.999");
            ensayo.fechaFin = new Date("2025/01/30 14:30:10.999");
            const response = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear procesión con fecha salida invalida", async() => {
            procesion.banda = bandaId;
            procesion.fechaInicio = new Date("2025/01/30 15:30:10.999");
            procesion.fechaFin =    new Date("2025/01/30 16:30:10.999");
            procesion.fechaSalida = new Date("2025/01/30 17:30:10.999");

            const response = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear actuación con fecha salida invalida", async() => {
           const c = {
            "titulo": "Concierto de prueba",
            "descripcion": "Descripción de prueba",
            "fechaInicio": new Date("2025/01/30 15:30:10.999"),
            "fechaFin": new Date("2025/01/30 16:30:10.999"),
            "localidad": "Localidad de prueba",
            "provincia": "Provincia de prueba",
            "lugar": "Lugar de prueba",
            "tipoActuacion": "Concierto",
            "fechaSalida": new Date("2025/01/30 20:30:10.999"),
            "lugarSalida": "Lugar de salida de prueba",
            "beneficios": 100,
            "costes": 100,
            "comentarioEconomico": "Comentario económico de prueba"}
        
            const response = await request(app).post('/api/eventos/actuacion').send(c).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear actuación sin token de directivo", async() => {
            concierto.banda = bandaId;
            concierto._id = undefined;
            const response = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Crear ensayo sin token de directivo", async() => {
            ensayo.banda = bandaId;
            const response = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token2);
            expect(response.statusCode).toBe(400);
        });

        test("Actualizar procesion sin ser directivo", async() => {
            // Creamos una procesion valida
            procesion.banda = bandaId;
            procesion.fechaInicio = new Date("2025/01/30 15:30:10.999");
            procesion.fechaFin =    new Date("2025/01/30 16:30:10.999");
            procesion.fechaSalida = new Date("2025/01/30 13:30:10.999");
            const response1 = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            expect(response1.body.procesionDB).toHaveProperty('titulo');
            procesionId = response1.body.procesionDB._id;
            procesion.transaccion = response1.body.procesionDB.transaccion;

            const response = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            // Eliminamos la procesion
            await request(app).delete('/api/eventos/Procesión/id/' + procesionId).set('x-token', token);
        });

        test("Actualizar actuación sin ser directivo", async() => {
            // Creamos una actuacion valida
            concierto.fechaInicio = new Date("2025/01/30 15:30:10.999");
            concierto.fechaFin =    new Date("2025/01/30 16:30:10.999");
            concierto.fechaSalida = new Date("2025/01/30 13:30:10.999");
            concierto.banda = bandaId;
            const response1 = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            expect(response1.body.actuacionDB).toHaveProperty('titulo');
            actuacionId = response1.body.actuacionDB._id;
            concierto.transaccion = response1.body.actuacionDB.transaccion;

            const response = await request(app).put('/api/eventos/actuacion/' + actuacionId).send(concierto).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            // Eliminamos la actuacion
            await request(app).delete('/api/eventos/Actuación/id/' + actuacionId).set('x-token', token);
        });

        test("Actualizar ensayo sin ser directivo", async() => {
            // Creamos un ensayo valido
            ensayo.banda = bandaId;
            ensayo._id = undefined;
            ensayo.fechaInicio = new Date("2025/01/30 15:30:10.999");
            ensayo.fechaFin =    new Date("2025/01/30 16:30:10.999");
            const response1 = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            expect(response1.body.ensayoDB).toHaveProperty('titulo');
            ensayoId = response1.body.ensayoDB._id;

            const response = await request(app).put('/api/eventos/ensayo/' + ensayoId).send(ensayo).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            // Eliminamos el ensayo
            await request(app).delete('/api/eventos/Ensayo/id/' + ensayoId).set('x-token', token);
        });

        test("Eliminar procesion sin ser directivo", async() => {
            // Creamos una procesion valida
            procesion.banda = bandaId;
            procesion.fechaInicio = new Date("2025/01/30 15:30:10.999");
            procesion.fechaFin =    new Date("2025/01/30 16:30:10.999");
            procesion.fechaSalida = new Date("2025/01/30 13:30:10.999");
            const response1 = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            expect(response1.body.procesionDB).toHaveProperty('titulo');
            procesionId = response1.body.procesionDB._id;
            procesion.transaccion = response1.body.procesionDB.transaccion;

            const response = await request(app).delete('/api/eventos/Procesión/id/' + procesionId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            // Eliminamos la procesion
            await request(app).delete('/api/eventos/Procesión/id/' + procesionId).set('x-token', token);
        });

        test("Eliminar actuación sin ser directivo", async() => {
            // Creamos una actuacion valida
            concierto.fechaInicio = new Date("2025/01/30 15:30:10.999");
            concierto.fechaFin =    new Date("2025/01/30 16:30:10.999");
            concierto.fechaSalida = new Date("2025/01/30 13:30:10.999");
            concierto.banda = bandaId;
            const response1 = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            expect(response1.body.actuacionDB).toHaveProperty('titulo');
            actuacionId = response1.body.actuacionDB._id;
            concierto.transaccion = response1.body.actuacionDB.transaccion;

            const response = await request(app).delete('/api/eventos/Actuación/id/' + actuacionId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            // Eliminamos la actuacion
            await request(app).delete('/api/eventos/Actuación/id/' + actuacionId).set('x-token', token);
        });

        test("Eliminar ensayo sin ser directivo", async() => {
            // Creamos un ensayo valido
            ensayo.banda = bandaId;
            ensayo._id = undefined;
            ensayo.fechaInicio = new Date("2025/01/30 15:30:10.999");
            ensayo.fechaFin =    new Date("2025/01/30 16:30:10.999");
            const response1 = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            expect(response1.statusCode).toBe(200);
            expect(response1.body.ensayoDB).toHaveProperty('titulo');
            ensayoId = response1.body.ensayoDB._id;

            const response = await request(app).delete('/api/eventos/Ensayo/id/' + ensayoId).set('x-token', token2);
            expect(response.statusCode).toBe(400);
            // Eliminamos el ensayo
            await request(app).delete('/api/eventos/Ensayo/id/' + ensayoId).set('x-token', token);
        });

        test("Crear procesion con valores invalidos", async() => {
            procesion.banda = bandaId;
            procesion.fechaInicio = new Date("2005/01/30 15:30:10.999");
            const response = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(400);

            procesion.fechaInicio = new Date("2025/01/30 15:30:10.999");
            procesion.fechaFin = new Date("2005/01/30 15:30:10.999");
            const response2 = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response2.statusCode).toBe(400);

            procesion.fechaFin = new Date("2025/01/30 16:30:10.999");
            procesion.dia = "Dia de prueba";
            const response3 = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response3.statusCode).toBe(400);

            procesion.dia = "Viernes Dolores";
            procesion.tipo = "Tipo de prueba";
            const response4 = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response4.statusCode).toBe(400);

            procesion.tipo = "Gloria";
            procesion.fechaSalida = new Date("2005/01/30 15:30:10.999");
            const response5 = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            expect(response5.statusCode).toBe(400);

        });

        test("Actualizar procesion con valores invalidos", async() => {
            procesion.banda = bandaId;
            procesion.fechaInicio = new Date("2005/01/30 15:30:10.999");
            const response = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token);
            expect(response.statusCode).toBe(400);

            procesion.fechaInicio = new Date("2025/01/30 15:30:10.999");
            procesion.fechaFin = new Date("2005/01/30 15:30:10.999");
            const response2 = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token);
            expect(response2.statusCode).toBe(400);

            procesion.fechaFin = new Date("2025/01/30 16:30:10.999");
            procesion.dia = "Dia de prueba";
            const response3 = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token);
            expect(response3.statusCode).toBe(400);

            procesion.dia = "Viernes Dolores";
            procesion.tipo = "Tipo de prueba";
            const response4 = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token);
            expect(response4.statusCode).toBe(400);

            procesion.tipo = "Gloria";
            procesion.fechaSalida = new Date("2005/01/30 15:30:10.999");
            const response5 = await request(app).put('/api/eventos/procesion/' + procesionId).send(procesion).set('x-token', token);
            expect(response5.statusCode).toBe(400);
        });

        test("Crear actuación con valores invalidos", async() => {
            concierto.banda = bandaId;
            concierto.fechaInicio = new Date("2005/01/30 15:30:10.999");
            const response = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response.statusCode).toBe(400);

            concierto.fechaInicio = new Date("2025/01/30 15:30:10.999");
            concierto.fechaFin = new Date("2005/01/30 15:30:10.999");
            const response2 = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response2.statusCode).toBe(400);

            concierto.fechaFin = new Date("2025/01/30 16:30:10.999");
            concierto.fechaSalida = new Date("2005/01/30 15:30:10.999");
            const response3 = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response3.statusCode).toBe(400);

            concierto.fechaSalida = new Date("2025/01/30 13:30:10.999");
            concierto.tipoActuacion = "Tipo de prueba";
            const response4 = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            expect(response4.statusCode).toBe(400);
        });

        test("Actualizar actuación con valores invalidos", async() => {
            concierto.banda = bandaId;
            concierto.fechaInicio = new Date("2005/01/30 15:30:10.999");
            const response = await request(app).put('/api/eventos/actuacion/' + actuacionId).send(concierto).set('x-token', token);
            expect(response.statusCode).toBe(400);

            concierto.fechaInicio = new Date("2025/01/30 15:30:10.999");
            concierto.fechaFin = new Date("2005/01/30 15:30:10.999");
            const response2 = await request(app).put('/api/eventos/actuacion/' + actuacionId).send(concierto).set('x-token', token);
            expect(response2.statusCode).toBe(400);

            concierto.fechaFin = new Date("2025/01/30 16:30:10.999");
            concierto.fechaSalida = new Date("2005/01/30 15:30:10.999");
            const response3 = await request(app).put('/api/eventos/actuacion/' + actuacionId).send(concierto).set('x-token', token);
            expect(response3.statusCode).toBe(400);

            concierto.fechaSalida = new Date("2025/01/30 13:30:10.999");
            concierto.tipoActuacion = "Tipo de prueba";
            const response4 = await request(app).put('/api/eventos/actuacion/' + actuacionId).send(concierto).set('x-token', token);
            expect(response4.statusCode).toBe(400);
        });

        test("Crear ensayo con valores invalidos", async() => {
            ensayo.banda = bandaId;
            ensayo.fechaInicio = new Date("2005/01/30 15:30:10.999");
            const response = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            expect(response.statusCode).toBe(400);

            ensayo.fechaInicio = new Date("2025/01/30 15:30:10.999");
            ensayo.fechaFin = new Date("2005/01/30 15:30:10.999");
            const response2 = await request(app).post('/api/eventos/ensayo').send(ensayo).set('x-token', token);
            expect(response2.statusCode).toBe(400);

        });

        test("Actualizar ensayo con valores invalidos", async() => {
            ensayo.banda = bandaId;
            ensayo.fechaInicio = new Date("2005/01/30 15:30:10.999");

            const response = await request(app).put('/api/eventos/ensayo/' + ensayoId).send(ensayo).set('x-token', token);
            expect(response.statusCode).toBe(400);

            ensayo.fechaInicio = new Date("2025/01/30 15:30:10.999");
            ensayo.fechaFin = new Date("2005/01/30 15:30:10.999");
            const response2 = await request(app).put('/api/eventos/ensayo/' + ensayoId).send(ensayo).set('x-token', token);
            expect(response2.statusCode).toBe(400);
        });


    
        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });
});