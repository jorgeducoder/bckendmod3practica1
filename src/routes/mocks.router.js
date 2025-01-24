import { Router } from 'express';

import logger, { requestLogger } from '../utils/logger.js';


import { generatePets } from "../mocks/petsMocks.js"; // Importa el generador de mocks

import { generateUsers } from "../mocks/usersMocks.js"; // Importa el generador de mocks

import petModel from '../dao/models/Pet.js'; // Importa el modelo de mascotas

import userModel from '../dao/models/User.js'; // Asegúrate de que este sea el camino correcto al modelo

const router = Router();

router.get('/mockingpets', async (req, res) => {
   
    try {

        // Leer el parámetro `count` de la URL
        const count = parseInt(req.query.count, 10) || 1; // Por defecto, genera 1 mascota si no se especifica `count`

        // Validar que el valor de count sea un número válido
        if (isNaN(count) || count <= 0 || count > 100) {
            return res.status(400).send({ error: 'El parámetro count debe ser un número positivo y menor a 100.' });
        }

        const pets = generatePets(count); // Genera hasta 100 mascotas
        
        // Registrar solo si hay mascotas generadas
          if (pets.length > 0) {
            logger.info(`Generadas ${pets.length} pets. Ejemplo: ${JSON.stringify(pets.slice(0, 5), null, 2)}`);
        } else {
            logger.warn('No se generaron mascotas.');
        }
                
        await petModel.deleteMany({});// elimino todas las mascotas de la base para no incrementar cada vez que se generan

        await petModel.insertMany(pets); // Inserta los mocks en la base de datos
        
        res.status(200).send({ message: `Se generaron ${count} mascotas de prueba.`, pets });
    
    } catch (error) {
        
        logger.error('Error generando mocks:', error);
        res.status(500).send({ error: 'Error generando mocks' });
    }
});

router.get('/mockingusers', async (req, res) => {
   
    try {

        // Leer el parámetro `count` de la URL
        const count = parseInt(req.query.count, 10) || 1; // Por defecto, genera 1 usuario si no se especifica `count`

        // Validar que el valor de count sea un número válido
        if (isNaN(count) || count <= 0 || count > 50) {
            return res.status(400).send({ error: 'El parámetro count debe ser un número positivo y menor a 50.' });
        }

        const users = await generateUsers(count); // Esperar la generación de usuarios
        logger.info(`Generados y en el get de users ${users.length} users.`);
        
        // Registrar solo si hay usuarios generados
          if (users.length > 0) {
            logger.info(`Generados ${users.length} users. Ejemplo: ${JSON.stringify(users.slice(0, 5), null, 2)}`);
        } else {
            logger.warn('No se generaron usuarios.');
        }
                
        await userModel.deleteMany({});// elimino todos los usuarios de la base para no incrementar cada vez que se generan

        await userModel.insertMany(users); // Inserta los mocks en la base de datos
        
        res.status(200).send({ message: `Se generaron ${count} usuarios de prueba.`, users });
    
    } catch (error) {
        
        logger.error('Error generando mocks:', error);
        res.status(500).send({ error: 'Error generando mocks' });
    }
});




// Endpoint POST para generar e insertar datos
router.post('/generateData', async (req, res) => {
  try {
    const { users, pets } = req.body;

    // Validar los parámetros
    if (
      !Number.isInteger(users) ||
      !Number.isInteger(pets) ||
      users <= 0 ||
      pets <= 0 ||
      users > 100 ||
      pets > 100
    ) {
      return res
        .status(400)
        .send({ error: 'Los parámetros deben ser números enteros positivos menores o iguales a 100.' });
    }

    // Generar datos
    const generatedUsers = await generateUsers(users); // Generar usuarios
    const generatedPets = generatePets(pets); // Generar mascotas

    // Limpiar las colecciones existentes
    await userModel.deleteMany({});
    await petModel.deleteMany({});

    // Insertar los nuevos datos
    await userModel.insertMany(generatedUsers);
    await petModel.insertMany(generatedPets);

    logger.info(`Generados ${users} usuarios y ${pets} mascotas.`);
    res.status(200).send({ message: `Se generaron ${users} usuarios y ${pets} mascotas.` });
  } catch (error) {
    logger.error('Error generando datos:', error);
    res.status(500).send({ error: 'Error generando datos' });
  }
});



export default router;