const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de obras", () => {

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


    const repertorio = {
        "titulo": "TestRepertorio",
        "descripcion": "TestRepertorio",
        "banda": "",
    }
    // archivero peticion
    const newPeticion = {
        "fecha": "1999-01-01",
        "mensaje": "Mensaje de prueba",
        "rol": "Archivero",

    }

    const obra = {
        "titulo": "TestObra",
        "compositor": "TestObra",
    }

    describe("Casos positivos de la api de obras", () => {
        let token = "";
        let uid = "";
        let bandaId = "";
        let repertorioId = "";
        let directivoId = "";
        let obraId = "";



        beforeAll(async () => {
            // Registramos usuario e iniciamos sesion
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;

            // Creamos una banda con el usuario anterior
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            // obtener mi directivo
            const response2 = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = response2.body.directivo[0]._id;

            // creamos peticion de archivero
            newPeticion.banda = bandaId;
            newPeticion.directivo = directivoId;
            newPeticion.usuario = uid;
            const response3 = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = response3.body.peticion._id;
            await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);

            // Creamos repertorio
            repertorio.banda = bandaId;
            const response4 = await request(app).post('/api/repertorios').send(repertorio).set('x-token', token);
            repertorioId = response4.body.nuevoRepertorio._id;
        });

        test("Crear obra", async () => {
            obra.repertorio = repertorioId;
            const response = await request(app).post('/api/obras').send(obra).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.nuevaObra.titulo).toBe(obra.titulo);
            expect(response.body.nuevaObra.compositor).toBe(obra.compositor);
            obraId = response.body.nuevaObra._id;
        });

        test("Obtener obras asignadas a un repertorio", async () => {
            const response = await request(app).get('/api/obras/repertorio/' + repertorioId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
            expect(response.body.obras[0].titulo).toBe(obra.titulo);
        });

        test("Eliminar obra", async () => {
            const response = await request(app).delete('/api/obras/' + obraId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.ok).toBe(true);
        });


        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);

        });
    });
    describe("Casos negativo de la api de obras", () => {
        let token = "";
        let uid = "";
        let token2 = "";
        let uid2 = "";
        let bandaId = "";
        let repertorioId = "";
        let directivoId = "";



        beforeAll(async () => {
            // Registramos usuario e iniciamos sesion
            await request(app).post('/api/auth/register').send(newUser);
            const loginReponse = await request(app).post('/api/auth').send({"correo": "testbanda@test.com", "contraseña": "asdf1234"});
            token = loginReponse.body.token;
            uid = loginReponse.body.uid;
            // Registramos y logeamos al otro usuario
            await request(app).post('/api/auth/register').send(newUser2);
            const loginReponse2 = await request(app).post('/api/auth').send({"correo": "testbanda2@test.com", "contraseña": "asdf1234"});
            token2 = loginReponse2.body.token;
            uid2 = loginReponse2.body.uid;

            // Creamos una banda con el usuario anterior
            const response = await request(app).post('/api/bandas').send(newBanda).set('x-token', token);
            bandaId = response.body.nueva_banda._id;

            // obtener mi directivo
            const response2 = await request(app).get('/api/directivos/byUserId/' + uid).set('x-token', token);
            directivoId = response2.body.directivo[0]._id;

            // creamos peticion de archivero
            newPeticion.banda = bandaId;
            newPeticion.directivo = directivoId;
            newPeticion.usuario = uid;
            const response3 = await request(app).post('/api/peticiones').send(newPeticion).set('x-token', token);
            peticionId = response3.body.peticion._id;
            await request(app).put('/api/peticiones/aceptar/' + peticionId + '/' + uid).set('x-token', token);

            // Creamos repertorio
            repertorio.banda = bandaId;
            const response4 = await request(app).post('/api/repertorios').send(repertorio).set('x-token', token);
            repertorioId = response4.body.nuevoRepertorio._id;
        });

        test("Crear obra sin ser directivo", async () => {
            obra.repertorio = repertorioId;
            const response = await request(app).post('/api/obras').send(obra).set('x-token', token2);
            expect(response.statusCode).toBe(401);
            expect(response.body.ok).toBe(false);
        });

        test("Crear obra sin que exista el repertorio", async () => {
            obra.repertorio = "6466080a3a2eecfc6c4d7a2c";
            const response = await request(app).post('/api/obras').send(obra).set('x-token', token);
            expect(response.statusCode).toBe(404);
            expect(response.body.ok).toBe(false);
        });

        test("Eliminar obra sin que exista", async () => {
            const response = await request(app).delete('/api/obras/' + "6466080a3a2eecfc6c4d7a2c").set('x-token', token);
            expect(response.statusCode).toBe(404);
            expect(response.body.ok).toBe(false);
        });

        test("Eliminar obra sin ser archivero", async () => {
            // Creamos una obra
            obra.repertorio = repertorioId;
            const response2 = await request(app).post('/api/obras').send(obra).set('x-token', token);
            expect(response2.statusCode).toBe(200);
            expect(response2.body.ok).toBe(true);

            // Eliminamos la obra con el otro usuario
            const response = await request(app).delete('/api/obras/' + "6466080a3a2eecfc6c4d7a2c").set('x-token', token2);
            expect(response.statusCode).toBe(404);
            expect(response.body.ok).toBe(false);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);

        });
    });
});