const request = require("supertest");
const { app } = require('../index');

describe("Pruebas de la api de repertorios", () => {

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



    describe("Casos positivos de la api de repertorios", () => {
        let token = "";
        let uid = "";
        let bandaId = "";
        let repertorioId = "";
        let directivoId = "";



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
        });


        test("Crear repertorio", async () => {
            repertorio.banda = bandaId;
            const response = await request(app).post('/api/repertorios').send(repertorio).set('x-token', token);
            repertorioId = response.body.nuevoRepertorio._id;
            expect(response.statusCode).toBe(200);
            expect(response.body.nuevoRepertorio.titulo).toBe(repertorio.titulo);
            expect(response.body.nuevoRepertorio.descripcion).toBe(repertorio.descripcion);
            expect(response.body.nuevoRepertorio.banda).toBe(repertorio.banda);
        }); 

        test("Obtener repertorios por banda", async () => {
            const response = await request(app).get('/api/repertorios/banda/' + bandaId).set('x-token', token);
            expect(response.statusCode).toBe(200);
            expect(response.body.repertorios[0].titulo).toBe(repertorio.titulo);
            expect(response.body.repertorios[0].descripcion).toBe(repertorio.descripcion);
        });

        test("Eliminar repertorio", async () => {
            // Creamos una obra con el usuario anterior
            obra.repertorio = repertorioId;
            const obra2 = await request(app).post('/api/obras').send(obra).set('x-token', token);
           
            // Eliminamos el repertorio
            const response = await request(app).delete('/api/repertorios/' + repertorioId).set('x-token', token);
            expect(response.statusCode).toBe(200);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);

        });

    });

    describe("Casos positivos de la api de repertorios", () => {
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
        });

        test("Crear repertorio sin ser archivero", async () => {
            repertorio.banda = bandaId;
            const response = await request(app).post('/api/repertorios').send(repertorio).set('x-token', token2);
            expect(response.statusCode).toBe(401);
        });

        test("Eliminar repertorio que no exista", async () => {
            const response = await request(app).delete('/api/repertorios/' + repertorioId).set('x-token', token2);
            expect(response.statusCode).toBe(404);
        });

        test("Eliminar un repertorio sin ser archivero de la banda", async () => {
            // Creamos un repertorio con el usuario anterior
            repertorio.banda = bandaId;
            const response = await request(app).post('/api/repertorios').send(repertorio).set('x-token', token);
            repertorioId = response.body.nuevoRepertorio._id;
            // Eliminamos el repertorio con el otro usuario
            const response2 = await request(app).delete('/api/repertorios/' + repertorioId).set('x-token', token2);
            expect(response2.statusCode).toBe(401);
        });

        afterAll(async () => {
            await request(app).delete('/api/bandas/' + bandaId).set('x-token', token);
            await request(app).delete('/api/auth/' + uid).set('x-token', token);
            await request(app).delete('/api/auth/' + uid2).set('x-token', token2);

        });
    });
});