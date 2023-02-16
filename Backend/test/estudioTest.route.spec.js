const request = require("supertest");
const { app } = require('../index');

describe('Pruebas sobre la API de estudios', () => {

    const newEstudio = {
        "fechaInicio": "2021-01-01",
        "fechaFin": "2021-01-02",
        "usuario": "Test",
        "tipoEstudio": "Grado elemental",
    }

    const newUser = {
        "nombre": "TestEstudio",
        "primer_apellido": "TestEstudio",
        "segundo_apellido": "TestEstudio",
        "fecha_nacimiento": "1999-01-01",
        "correo": "testestudio@test.com",
        "descripcion": "TestEstudio",
        "localidad": "TestEstudio",
        "provincia": "TestEstudio",
        "codigo_postal": 41400,
        "direccion": "TestEstudio",
        "nif": "76497455F",
        "telefono": 111222333,
        "usuario": "TestEstudio",
        "contraseña": "asdf1234"
    }

    describe('Pruebas sobre la API de estudios', () => {
        
        let token = "";
        let uid = "";

        let estudioId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testestudio@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
        });

        test("Crear estudio", async () => {
            newEstudio.usuario = uid;
            const response = await request(app).post('/api/estudios').send(newEstudio).set('x-token', token);
           
            expect(response.statusCode).toBe(200);
            expect(response.body.estudio).toHaveProperty('tipoEstudio');
            estudioId = response.body.estudio._id;
        });

        test("Editar estudio", async () => {
            newEstudio.usuario = uid;
            newEstudio.tipoEstudio = "Grado medio";
            const response = await request(app).put('/api/estudios/' + estudioId).send(newEstudio).set('x-token', token);

            expect(response.statusCode).toBe(200);
            expect(response.body.estudioActualizado.tipoEstudio).toBe('Grado medio');
        });

        test("Obtener estudios de un usuario", async () => {
            const response = await request(app).get('/api/estudios/estudiosByUserId/' + uid).set('x-token', token);

            expect(response.statusCode).toBe(200);
        });

        test("Obtener estudio por id", async () => {
            const response = await request(app).get('/api/estudios/estudioById/' + estudioId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        test("Eliminar estudio", async () => {
            const response = await request(app).delete('/api/estudios/eliminarById/' + estudioId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        afterAll(async () => {
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
    });

    describe("Casos negativos de la api estudios", () => {
        
        let token = "";
        let uid = "";

        let tokenInvalido = "";
        let uidInvalido = "";

        let estudioId = "";

        beforeAll(async () => {
            await request(app).post('/api/auth/register').send(newUser);
            let loginReponse = await request(app).post('/api/auth').send({"correo": "testestudio@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            loginReponse = await request(app).post('/api/auth').send({"correo": "alvaro.uber8@gmail.com", "contraseña": "asdf1234"});
            tokenInvalido = loginReponse.body.token;
            uidInvalido = loginReponse.body.uid;

            newEstudio.usuario = uid;
            const responseEstudio = await request(app).post('/api/estudios').send(newEstudio).set('x-token', token);
           
            estudioId = responseEstudio.body.estudio._id;
        });

        test("Crear estudio a otro usuario", async () => {
            newEstudio.usuario = uidInvalido;
            const response = await request(app).post('/api/estudios').send(newEstudio).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Crear estudio con fecha de final anterior a la inicial", async () => {
            newEstudio.usuario = uid;
            newEstudio.fechaFin = "2020-01-01";
            const response = await request(app).post('/api/estudios').send(newEstudio).set('x-token', token);
            expect(response.statusCode).toBe(400);
        });

        test("Editar estudio que no exista", async () => {
            newEstudio.usuario = uid;
            newEstudio.tipoEstudio = "Grado medio";
            const response = await request(app).put('/api/estudios/' + "63ab4ea1d1f42cf00f1294c0").send(newEstudio).set('x-token', token);

            expect(response.statusCode).toBe(404);
        });

        test("Editar estudio de otro usuario", async () => {
            newEstudio.usuario = uid;
            newEstudio.tipoEstudio = "Grado medio";
            const response = await request(app).put('/api/estudios/' + estudioId).send(newEstudio).set('x-token', tokenInvalido);

            expect(response.statusCode).toBe(400);
        });

        test("Editar estudio con fecha final anterior a la inicial", async () => {
            newEstudio.usuario = uid;
            newEstudio.tipoEstudio = "Grado medio";
            newEstudio.fechaFin = "2020-01-01";
            const response = await request(app).put('/api/estudios/' + estudioId).send(newEstudio).set('x-token', token);

            expect(response.statusCode).toBe(400);
        });

        test("Buscar un estudio inexsistente", async () => {
            const response = await request(app).get('/api/estudios/estudioById/' + "63ab4ea1d1f42cf00f1294c0").set('x-token', token);
            expect(response.statusCode).toBe(404);
        });

        test("Eliminar estudio a otro usuario", async () => {
            const response = await request(app).delete('/api/estudios/eliminarById/' + estudioId).set('x-token', tokenInvalido);
            expect(response.statusCode).toBe(400);
        });


        afterAll(async () => {
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
        });
            
    });



});