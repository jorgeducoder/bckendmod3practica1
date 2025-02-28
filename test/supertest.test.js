import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest'; // Importamos Supertest correctamente
import app from '../src/app.js';  // Importa la instancia de mi app de Express
import mongoose from 'mongoose';
import userModel from '../src/dao/models/User.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('API de Usuarios', () => {
    let testUserId;

    before(async () => {
        // Conectar a la base de datos de prueba
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        // Crear un usuario de prueba
        const newUser = await userModel.create({
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.perez@example.com',
            password: '123456',
            role: 'user',
            pets: []
        });

        testUserId = newUser._id;
    });

    after(async () => {
        // Eliminar usuarios de prueba y cerrar conexión
        await userModel.deleteMany({ email: 'juan.perez@example.com' }); // esto no funciona porque un put cambia el mail y no es necesario
                                                                         //  porque hay un delete del usuario creado
        await mongoose.connection.close();
    });

    // 🟢 TEST: Obtener todos los usuarios
    it('GET /api/users debería devolver todos los usuarios', async () => {
        const res = await request(app).get('/api/users');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.be.an('array');
    });

    // 🟢 TEST: Obtener un usuario por ID
    it('GET /api/users/:uid debería devolver un usuario específico', async () => {
        const res = await request(app).get(`/api/users/${testUserId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.payload).to.have.property('_id').equal(testUserId.toString());
        expect(res.body.payload).to.have.property('first_name');
        expect(res.body.payload).to.have.property('last_name');
        expect(res.body.payload).to.have.property('email');
    });

    // 🔴 TEST: Obtener un usuario con ID inválido
    it('GET /api/users/:uid debería devolver 404 si el usuario no existe', async () => {
        const res = await request(app).get('/api/users/000000000000000000000000');
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
    });

    // 🟢 TEST: Actualizar un usuario
    it('PUT /api/users/:uid debería actualizar un usuario', async () => {
        const res = await request(app)
            .put(`/api/users/${testUserId}`)
            .send({ first_name: 'Carlos' });
            console.log(res.body); // Agregar para ver la respuesta
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('payload');
        expect(res.body.payload).to.have.property('first_name').equal('Carlos');
    });

       

    // 🔴 TEST: Actualizar un usuario con datos inválidos
    it('PUT /api/users/:uid debería devolver 400 si los datos son inválidos', async () => {
        const res = await request(app)
            .put(`/api/users/${testUserId}`)
            .send({ email: 'correo-invalido' });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
    });

    

    // 🟢 TEST: Eliminar un usuario
    it('DELETE /api/users/:uid debería eliminar un usuario', async () => {
        const res = await request(app).delete(`/api/users/${testUserId}`);
        console.log(res.body); // Ver la respuesta
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Usuario eliminado correctamente');

    });

       

    // 🔴 TEST: Eliminar un usuario inexistente
    it('DELETE /api/users/:uid debería devolver 404 si el usuario no existe', async () => {
        const nonExistentUserId = '000000000000000000000000'; // Un ID que seguro no existe
    
        const res = await request(app).delete(`/api/users/${nonExistentUserId}`);
        console.log(res.body); // Ver la respuesta
    
        expect(res.status).to.equal(404);
    });
    
});
