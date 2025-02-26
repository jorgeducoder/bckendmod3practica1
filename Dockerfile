# Version de node que tengo instalada
FROM node:20.11.1 

WORKDIR /app

# Se copia en env para que tome el puerto 8080 y el modo de trabajo development
COPY package*.json .env ./

RUN npm install

COPY ./src ./src 

EXPOSE 8080

# No se utiliza npm test porque requiere que el servidor no este levantado.
CMD ["npm", "start"]