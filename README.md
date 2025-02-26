# Actividad Practica 1 y 2 mas Preentrega 1 y proyecto final
## Comisión 70195 - Programación Backend III

A partir del proyecto dado RecursosBackend-Adoptme se integran:

Practica 1: Mocks y la libreria Faker-JS mas TDD para manejo de errores personalizados

    Se agrega la carpeta mocks/petsMocks.js
    Se agrega middleware/errorhandlers para manejo de errores personalizados.
    Se agrega utils/CustomError.js

Practica 2: Logger

    Se incluye logger en el proyecto y endpoints para probarlos, se discrimina ambiente de prod y development.
    Se sustituyen console.log y errores destacados por mensajes con logger definido.

Preentrega 1: Definir errores personalizados y creacion de mascotas y usuarios en endpoints dados.

    Se crea un router nuevo para generar mascotas y usuarios desde el navegador y ambos a la vez desde una peticion Postman. mocks.router.js
    En los siguientes endpoints se generan mascotas y usuarios con get desde el navegador:

     http://localhost:8080/api/mocks/mockingpets?count=10 
     http://localhost:8080/api/mocks/mockingusers?count=20  

     En el endpoint /generatedata con postman se dan de alta x mascotas y z usuarios

Preentrega 1: Ajustes

    Si uno de los dos parametros es 0 no genera datos y no borra los existentes
    Si los dos son 0 no hace nada
    Si los dos son distintos de 0 genera datos nuevos y borra los anteriores.

Practica 3: Swagger

    Se agrega carpeta docs y archivo pets.yaml para documentar endpoints de mascotas.
    
Practica 4: Test funcional

    Se agrega mocha, chai y supertest para testing de endpoints de usuarios, se incluye archivo supertest.test.js
    Con los endpoints de prueba Get, Put y Delete.
    El test se ejecuta si no esta el servidor levantado, y el servidor no se levanta si esta configurada MODE como test


Proyecto final:

    a) Incluir Docker para generar imagenes y contenedores.

       Se genera el Dokerfile con el siguiente contenido:

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

        # Y se ejecuta en linea de comandos lo siguiente para generar/correr la virtual y actualizar docker desktop

        docker run -p 8080:8080 dockerjdmod3 

        # Para etiquetar y subir la imagen a docker hub

        docker tag dockerjdmod3 jorgedu/dockerjdmod3

        docker push jorgedu/dockerjdmod3

        # Quien recibe el link debe ejecutar

        docker pull jorgedu/dockerjdmod3
        docker run -p 8080:8080 jorgedu/dockerjdmod3

        
        *** Link para descargar la virtual ***

        https://hub.docker.com/repository/docker/jorgedu/dockerjdmod3/general

        *** Se proporciona uuario y clave de docker hub porque ir al link pide estos datos

        usuario: jorgedu
        clave: jdhermida

    b) Swagger en usuarios.

      Al visitar http://localhost:8080/api-docs, se debería ver documentados los endpoints de mascotas y usuarios.  
      Se requiere el archivo .env con el PORT = 8080 y ejecutar npm run dev
    
    c) Se agrega mocha, chai y supertest para testing de endpoints de mascotas.

    En package.json se modifica para ejecutar todos los test o individualmente
    "test": "mocha",
    "test:supertest": "mocha test/supertest.test.js",
    "test:pets": "mocha test/pets.test.js",
    "test:adoptions": "mocha test/adoptions.test.js"

    npm run test:supertest → Ejecuta solo los tests de usuarios.
    npm run test:pets → Ejecuta solo los tests de mascotas.
    npm run test:adoptions → Ejecuta solo los tests de adopciones.
    npm test → Ejecuta todas las pruebas.


   


