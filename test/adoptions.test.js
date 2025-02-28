import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import adoptionModel from '../src/dao/models/Adoption.js';
import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('API de Adopciones', () => {
    let testAdoptionId, testUserId, testPetId;

    before(async () => {
        // Conectar a la base de datos de prueba
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        // Crear un usuario y una mascota de prueba
        const newUser = await userModel.create({ 
            first_name: 'Test', 
            last_name: 'User', 
            email: 'testuser@example.com', 
            password: 'password123' // Asegúrate de cumplir con cualquier validación de contraseña que tenga el modelo
        });
        
        testUserId = newUser._id;

        const newPet = await petModel.create({ name: 'Test Pet', specie: 'dog', birthDate: '2021-06-10' });
        testPetId = newPet._id;

        // Crear una adopción de prueba
        const newAdoption = await adoptionModel.create({ owner: testUserId, pet: testPetId });
        testAdoptionId = newAdoption._id;
    });

    after(async () => {
        // Eliminar datos de prueba y cerrar conexión
        await adoptionModel.deleteMany({ owner: testUserId });
        await userModel.deleteOne({ _id: testUserId });
        await petModel.deleteOne({ _id: testPetId });
        await mongoose.connection.close();
    });

    // 🟢 TEST: Obtener todas las adopciones
    it('GET /api/adoptions debería devolver todas las adopciones', async () => {
        const res = await request(app).get('/api/adoptions');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.be.an('array');
        expect(res.body.payload.length).to.be.greaterThan(0);
    });

    // 🟢 TEST: Obtener una adopción específica
    it('GET /api/adoptions/:aid debería devolver una adopción válida', async () => {
        const res = await request(app).get(`/api/adoptions/${testAdoptionId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.payload).to.be.an('object');
        expect(res.body.payload).to.have.property('_id').equal(testAdoptionId.toString());
        expect(res.body.payload).to.have.property('owner').equal(testUserId.toString());
        expect(res.body.payload).to.have.property('pet').equal(testPetId.toString());
    });

    // 🔴 TEST: Obtener una adopción inexistente
    it('GET /api/adoptions/:aid debería devolver 404 si la adopción no existe', async () => {
        const res = await request(app).get('/api/adoptions/000000000000000000000000');
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').equal('Adoption not found');
    });
});
