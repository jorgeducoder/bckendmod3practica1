
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import logger from '../utils/logger.js';

// Función para generar usuarios de prueba
export const generateUsers = async (count) => {
  logger.debug('Entre a generar usuarios');

  const users = [];

  // Generar usuarios de prueba
  for (let i = 0; i < count; i++) {
    const hashedPassword = await bcrypt.hash('coder123', 10); // Encriptar la contraseña "coder123"
    const user = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: faker.helpers.arrayElement(['user', 'admin']), // Alternar entre "user" y "admin"
      pets: [], // Array vacío
    };

    users.push(user);
  }

  logger.info(
    `Generados en el array ${users.length} users. Ejemplo: ${JSON.stringify(users.slice(0, 5), null, 2)}`
  );

  return users;
};
