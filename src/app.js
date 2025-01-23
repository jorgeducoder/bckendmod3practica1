import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

// Importo lo necesario para generar los mocks
import { generatePets } from './mocks/petsMocks.js'; // Importa el generador de mocks
import petModel from './dao/models/Pet.js'; // Importa el modelo de mascotas

// Importo el mid para manejo de errores custom
import { errorHandler } from './middleware/errorHandler.js';

// importo y uso el midd antes de conectar a la base para probar que funcione logger
import logger, { requestLogger } from './utils/logger.js';


// Establecer el modo de strictQuery explícitamente por error al ejecutar npm run dev
// y agrego confirmcion de conexion a la base de datos
mongoose.set('strictQuery', false); // Cambia a false si prefieres esa configuración

const app = express();
const PORT = process.env.PORT||3000;
app.use(requestLogger);
const connection = mongoose.connect
       (`mongodb+srv://jeduclosson:HoIOatEgfADTFsA6@cluster0.ngvrtai.mongodb.net/petsmod3?retryWrites=true&w=majority&appName=Cluster0`,
     {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            logger.info('Conexión exitosa a la base de datos');
        })
        .catch((error) => {
            logger.error('Error al conectar a la base de datos:', error);
        });


app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

// Endpoint para probar manejo de errores custom
app.get('/prueba2', async(req, res, next) => {

    try {
        console.log(fafafa)
        
    } catch (error) {
        // res.setHeader('Content-Type','application/json');
        // return res.status(500).json({error:`Algo paso...!!! error desde ruta...!!!`})
        logger.error('Error en endpoint prueba2:', error);
        return next(error)
    }

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('prueba2');
})


// Endpoint para generar mascotas de prueba
app.get('/mockingpets', async (req, res) => {
   
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

// endpoint para probar el logger
app.get('/loggerTest', (req, res) => {
    logger.debug('Debug level: Detalles técnicos útiles para desarrollo');
    logger.http('HTTP level: Información sobre solicitudes HTTP');
    logger.info('Info level: Mensaje informativo general');
    logger.warn('Warning level: Posible problema detectado');
    logger.error('Error level: Algo salió mal');
    //logger.log('Fatal level: Error crítico que podría detener la aplicación');
    logger.fatal('Fatal level: Error crítico que podría detener la aplicación');
    res.send('Logger completado. Ver mensajes en consola o log files.');
  });

app.listen(PORT,()=>logger.info(`Listening on ${PORT}`))
