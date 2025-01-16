import { faker } from '@faker-js/faker';

export const generatePets = (count) => {
    const pets = [];
    for (let i = 0; i < count; i++) {
        pets.push({
            name: faker.animal.petName(), // Genera un nombre
            specie: faker.animal.type(),  // Genera un tipo de animal
            birthDate: faker.date.past(10), // Fecha de nacimiento aleatoria de los últimos 10 años
            adopted: false, // Siempre será false
            owner: null, // Sin dueño
            image: faker.image.urlPicsumPhotos(640, 480), // URL de imagen de prueba
           
        });
    }
    return pets;
};