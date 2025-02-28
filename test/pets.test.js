import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import petModel from '../src/dao/models/Pet.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('API de Mascotas', () => {
    let testPetId;

    before(async () => {
        // Conectar a la base de datos de prueba
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        // Crear una mascota de prueba
        const newPet = await petModel.create({
            name: 'Bobby',
            specie: 'dog',
            birthDate: '2020-01-01'
        });

        testPetId = newPet._id;
    });

    after(async () => {
        // Eliminar mascotas de prueba y cerrar conexión
        await petModel.deleteMany({ name: 'Bobby' });
        await mongoose.connection.close();
    });

    // 🟢 TEST: Obtener todas las mascotas
    it('GET /api/pets debería devolver todas las mascotas', async () => {
        const res = await request(app).get('/api/pets');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.be.an('array');
    });

    // 🟢 TEST: Crear una mascota
    it('POST /api/pets debería crear una nueva mascota', async () => {
        const res = await request(app)
            .post('/api/pets')
            .send({ name: 'Rocky', specie: 'cat', birthDate: '2021-05-15' });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status').equal('success');
        expect(res.body.payload).to.have.property('name').equal('Rocky');
        expect(res.body.payload).to.have.property('specie').equal('cat');
    });

    // 🔴 TEST: Crear una mascota con datos inválidos
    it('POST /api/pets debería devolver 400 si los datos son inválidos', async () => {
        const res = await request(app)
            .post('/api/pets')
            .send({ name: '', specie: 'dog' });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
    });

    // 🟢 TEST: Actualizar una mascota
    it('PUT /api/pets/:pid debería actualizar una mascota', async () => {
        const res = await request(app)
            .put(`/api/pets/${testPetId}`)
            .send({ name: 'Max' });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('pet updated');
    });

    // 🔴 TEST: Actualizar una mascota con datos inválidos
    it('PUT /api/pets/:pid debería devolver 400 si los datos son inválidos', async () => {
        const res = await request(app)
            .put(`/api/pets/${testPetId}`)
            .send({ adopted: 'yes' });
    
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message'); // Cambiar 'error' por 'message' 
    });
    

    // 🟢 TEST: Eliminar una mascota
    it('DELETE /api/pets/:pid debería eliminar una mascota', async () => {
        const res = await request(app).delete(`/api/pets/${testPetId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').equal('Pet deleted');
    });

    // 🔴 TEST: Eliminar una mascota inexistente
    it('DELETE /api/pets/:pid debería devolver 404 si la mascota no existe', async () => {
        const res = await request(app).delete('/api/pets/000000000000000000000000');
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
    });
});
