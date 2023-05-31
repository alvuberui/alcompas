const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de likes", () => {

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

    const newBanda2 = {
        "nombre": "TestBanda",
        "tipo": "Agrupación Musical",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "año_fundacion": 1999,
        "descripcion": "TestBanda",
        "telefono": 111222373,
        "correo": "testbanda2@gmail.com",
        "cif": "A25810748",
    }

    const newBanda3 = {
        "nombre": "TestBanda",
        "tipo": "Agrupación Musical",
        "localidad": "TestBanda",
        "provincia": "TestBanda",
        "codigo_postal": 41400,
        "direccion": "TestBanda",
        "año_fundacion": 1999,
        "descripcion": "TestBanda",
        "telefono": 111224373,
        "correo": "testbanda3@gmail.com",
        "cif": "A47833496",
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

    const date = new Date();
    date.setMonth(date.getMonth() + 4)
    const dateIncio = new Date();
    dateIncio.setMonth(dateIncio.getMonth() + 4);
    dateIncio.setHours(dateIncio.getHours() + 3)
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 4)
    dateFin.setHours(dateFin.getHours() + 5)

    const concierto = {
        "titulo": "Concierto de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": dateIncio,
        // añadirles unos meses a date
        "fechaFin": dateFin,
        "localidad": "Localidad de prueba",
        "provincia": "Provincia de prueba",
        "lugar": "Lugar de prueba",
        "tipoActuacion": "Concierto",
        "fechaSalida": date,
        "lugarSalida": "Lugar de salida de prueba",
        "beneficios": 100,
        "costes": 100,
        "comentarioEconomico": "Comentario económico de prueba",
    }

    const procesion = {
        "titulo": "Procesión de prueba",
        "descripcion": "Descripción de prueba",
        "fechaInicio": dateIncio,
        "fechaFin": dateFin,
        "localidad": "Localidad de prueba",
        "provincia": "Provincia de prueba",
        "lugar": "Lugar de prueba",
        "costes": 100,
        "beneficios": 100,
        "comentarioEconomico": "Comentario económico de prueba",
        "dia": "Viernes Dolores",
        "tipo": "Semana Santa",
        "fechaSalida": date,
        "lugarSalida": "Lugar de salida de prueba",
        "hermandad": "Hermandades de prueba",
        "nombreTitular": "Nombre de titular de prueba",
        "bocadillo": true,
    }

    describe("Casos positivos de la api de likes", () => {

        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId1 = "";
        let bandaId2 = "";
        let bandaId3 = "";
        let procesionId1 = "";
        let actuacionId1 = "";
        let actuacionId2 = "";

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
            bandaId1 = response.body.nueva_banda._id;
            const response2 = await request(app).post('/api/bandas').send(newBanda2).set('x-token', token);
            bandaId2 = response2.body.nueva_banda._id;
            const response3 = await request(app).post('/api/bandas').send(newBanda3).set('x-token', token);
            bandaId3 = response3.body.nueva_banda._id;
            procesion.banda = bandaId1;
            concierto.banda = bandaId1;
            const responseProcesion = await request(app).post('/api/eventos/procesion').send(procesion).set('x-token', token);
            procesionId1 = responseProcesion.body.procesionDB._id;
            procesion.transaccion = responseProcesion.body.procesionDB.transaccion;
            const responseConcierto = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            actuacionId1 = responseConcierto.body.actuacionDB._id;
            concierto.transaccion = responseConcierto.body.actuacionDB.transaccion;

            concierto.banda = bandaId2;
            const responseConcierto2 = await request(app).post('/api/eventos/actuacion').send(concierto).set('x-token', token);
            actuacionId2 = responseConcierto2.body.actuacionDB._id;
            concierto.transaccion = responseConcierto2.body.actuacionDB.transaccion;

            // dar like a banda 1
            await request(app).post('/api/likes').send({"tipo": "Banda", "referencia": bandaId1, "usuario": uid}).set('x-token', token);
            await request(app).post('/api/likes').send({"tipo": "Banda", "referencia": bandaId1, "usuario": uid2}).set('x-token', token2);
            // dar like a banda 2
            await request(app).post(`/api/likes/banda/${bandaId2}`).set('x-token', token2);
        });


        test("Obtener bandas con mas contratos semana santa", async () => {
            const response = await request(app).get('/api/estadisticas/contratos/semana-santa').set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            /*
            SE COMENTA ESTE TROZO DE TEST POR QUE ESTOS DATOS CAMBIAN SEGÚN ESTE POBLADA LA BASE DE DATOS
            CAMBIAR PARÁMETROS PARA QUE CONCUERDEN CON LOS DE LA BASE DE DATOS Y FUNCIONE CORRECTAMENTE
            expect(response.body.bandas.length).toBe(4);
            expect(response.body.bandas[0].numero).toBe(1);
            expect(response.body.bandas[1].numero).toBe(0);
            expect(response.body.bandas[2].numero).toBe(0);
            */
        });

        test("Obtener bandas con mas likes", async () => {
            const response = await request(app).get('/api/estadisticas/likes').set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            /*
            SE COMENTA ESTE TROZO DE TEST POR QUE ESTOS DATOS CAMBIAN SEGÚN ESTE POBLADA LA BASE DE DATOS
            CAMBIAR PARÁMETROS PARA QUE CONCUERDEN CON LOS DE LA BASE DE DATOS Y FUNCIONE CORRECTAMENTE
            expect(response.body.bandas.length).toBe(4);
            expect(response.body.bandas[0].numero).toBe(2);
            expect(response.body.bandas[1].numero).toBe(1);
            expect(response.body.bandas[2].numero).toBe(0);
            */
        });

        test("Obtener bandas con mas contratos semana santa", async () => {
            const response = await request(app).get('/api/estadisticas/contratos').set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            /*
            SE COMENTA ESTE TROZO DE TEST POR QUE ESTOS DATOS CAMBIAN SEGÚN ESTE POBLADA LA BASE DE DATOS
            CAMBIAR PARÁMETROS PARA QUE CONCUERDEN CON LOS DE LA BASE DE DATOS Y FUNCIONE CORRECTAMENTE
            expect(response.body.bandas.length).toBe(4);
            expect(response.body.bandas[0].numero).toBe(1);
            expect(response.body.bandas[1].numero).toBe(0);
            expect(response.body.bandas[2].numero).toBe(0);
            */
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId1).set('x-token', token);
            await request(app).delete('/api/bandas/' + bandaId2).set('x-token', token);
            await request(app).delete('/api/bandas/' + bandaId3).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);
        });
    });
});