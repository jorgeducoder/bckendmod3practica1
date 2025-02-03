# Actividad Practica 1 y 2 mas Preentrega 1
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





