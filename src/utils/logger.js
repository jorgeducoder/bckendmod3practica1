// Aqui voy a crear las definiciones de mi logger


import winston from 'winston';
import path from 'path';

// Defino niveles personalizados
const customLevels = {
  levels: {
    fatal: 0, // Nivel más crítico
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};




// Determino si estoy en desarrollo o producción

const isDevelopment = process.env.MODE === 'development';  // cambiar en env 

// Configuro transportes 
const transports = [
  new winston.transports.Console({
    level: isDevelopment ? 'debug' : 'info', // Nivel mínimo en consola
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

if (!isDevelopment) {
  // Solo en producción, guarda errores de nivel error o superior en un archivo
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: winston.format.json(), // Formato JSON para el archivo
    })
  );
}

// Crea el logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  //level: 'debug', // Nivel mínimo global
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports,
});

// Configuro colores para los niveles personalizados
winston.addColors(customLevels.colors);

// Middleware para registrar solicitudes HTTP
export const requestLogger = (req, res, next) => {
  logger.http(`HTTP ${req.method} ${req.url}`);
  next();
};

export default logger;
