import { config } from "./config/config.js";
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

// Importo lo necesario para generar los mocks

import mocksRouter from './routes/mocks.router.js';


// importo y uso el midd antes de conectar a la base para probar que funcione logger
import logger, { requestLogger } from './utils/logger.js';

// Importo las funciones  necesarias para usar swagger

import swagger from 'swagger-jsdoc';
import swageerUi from "swagger-ui-express";

// Establecer el modo de strictQuery explícitamente por error al ejecutar npm run dev
// y agrego confirmcion de conexion a la base de datos
mongoose.set('strictQuery', false); // Cambia a false si se prefiere esa configuración

const app = express();
const PORT = process.env.PORT||3000;
logger.info(`PORT en app:  ${PORT}`);
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

// Incorporo Swagger para documentacion de CRUD Pets

const options={
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentacion CRUD pets",
            version: "1.0.0",
            description: "Documentacion CRUD pets - Detalles"
        }
    },
    apis: ["./src/docs/*.yaml"]
}

const spec=swagger(options)
app.use("/api-docs", swageerUi.serve, swageerUi.setup(spec))



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

// Monto el router en la ruta base /api/mocks luego que movi app.get a mocks.router.js

app.use('/api/mocks', mocksRouter);

// http://localhost:8080/api/mocks/mockingpets?count=10 ahora la llamada seria asi para no escribir /mockingpets/pets
// http://localhost:8080/api/mocks/mockingusers?count=20  la llamada seria asi para usuarios


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

  export default app;  // para ejecutar supertest


//app.listen(PORT,()=>logger.info(`Listening on ${PORT}`))
// Solo iniciar el servidor si no se está ejecutando en modo test



logger.info(`process.env.MODE en app:  ${process.env.MODE}`);

if (process.env.MODE !== 'test') {
    app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
}

