/*process.loadEnvFile("./src/.env") no tengo la version de node que lo soporta


export const config={
    PORT: process.env.PORT, 
    MODE: process.env.MODE
}*/

import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
//dotenv.config({ path: "./src/.env" });
dotenv.config({ path: ".env" });

console.log("Variables de entorno cargadas en config:");
console.log("PORT:", process.env.PORT);
console.log("MODE:", process.env.MODE);


// Exportar la configuración como un objeto
export const config = {
    PORT: process.env.PORT, // Puerto definido en .env
    MODE: process.env.MODE  // Modo definido en .env
};



