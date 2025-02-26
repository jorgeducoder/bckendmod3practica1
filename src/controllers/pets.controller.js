import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

// Importo las funciones para manejo de errores en Pet
import { CustomError } from '../utils/CustomError.js';
import { altaPetError } from '../utils/erroresPet.js';
import { TIPOS_ERROR } from '../utils/TiposError.js';

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}
// Funcion usada para los CustomError y cambiada para el test funcional. 
/*const createPet = async(req,res)=> {
        
    // Controles agregados para el manejo de errores

        const {name,specie,birthDate}=req.body
        if(!name){
            //Ejemplo para error de usuario
            CustomError.generarError("Error Alta Mascota", "Complete al menos el name", altaPetError(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            
        }
    
        let propiedadesValidas=['name','specie', 'birthDate']
        let propiedadesPetNueva=Object.keys(req.body)
        let valido=propiedadesPetNueva.every(prop=>propiedadesValidas.includes(prop))
    
        if(!valido){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ha ingresado propiedades invalidas`, detalle:propiedadesValidas})
        }
    
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
}*/


const createPet = async (req, res) => {
    try {
        const { name, specie, birthDate } = req.body;

        if (!name) { 
            return res.status(400).json({ error: "Complete al menos el name" });
        }

        let propiedadesValidas = ['name', 'specie', 'birthDate'];
        let propiedadesPetNueva = Object.keys(req.body);
        let valido = propiedadesPetNueva.every(prop => propiedadesValidas.includes(prop));

        if (!valido) {
            return res.status(400).json({ 
                error: "Ha ingresado propiedades inválidas", 
                detalle: propiedadesValidas 
            });
        }

        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);

        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
    }
};


const updatePet = async (req, res) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    // Validaciones manuales
    if (!petUpdateBody || Object.keys(petUpdateBody).length === 0) {
        return res.status(400).json({ status: "error", message: "No se enviaron datos para actualizar" });
    }

    // Validación estricta para 'adopted' (solo acepta true o false)
    if (petUpdateBody.hasOwnProperty("adopted") && typeof petUpdateBody.adopted !== "boolean") {
        return res.status(400).json({ status: "error", message: "El campo 'adopted' debe ser booleano (true o false)" });
    }

    if (petUpdateBody.name && (typeof petUpdateBody.name !== 'string' || petUpdateBody.name.length < 2)) {
        return res.status(400).json({ status: "error", message: "El nombre debe ser una cadena con al menos 2 caracteres" });
    }

    const validSpecies = ['dog', 'cat', 'bird', 'other'];
    if (petUpdateBody.specie && !validSpecies.includes(petUpdateBody.specie)) {
        return res.status(400).json({ status: "error", message: "Especie inválida. Valores permitidos: dog, cat, bird, other" });
    }

    if (petUpdateBody.birthDate && isNaN(Date.parse(petUpdateBody.birthDate))) {
        return res.status(400).json({ status: "error", message: "Fecha de nacimiento inválida" });
    }

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (petUpdateBody.owner && !objectIdRegex.test(petUpdateBody.owner)) {
        return res.status(400).json({ status: "error", message: "ID de owner inválido" });
    }

    if (petUpdateBody.image && typeof petUpdateBody.image !== 'string') {
        return res.status(400).json({ status: "error", message: "El campo image debe ser una URL en formato string" });
    }

    try {
        const result = await petsService.update(petId, petUpdateBody);
        res.send({ status: "success", message: "pet updated", data: result });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};


const deletePet = async (req, res) => {
    const petId = req.params.pid;

    try {
        // Verificar si la mascota existe utilizando el DAO
        const pet = await petsService.getBy({ _id: petId });
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        // Proceder con la eliminación
        const result = await petsService.delete(petId);

        // Verificar que se haya eliminado correctamente
        if (!result) {  // Si result es null o undefined, significa que no se encontró la mascota para eliminar
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        res.send({ status: "success", message: "Pet deleted" });
        
    } catch (error) {
        console.error('Error al eliminar la mascota:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};



const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    console.log(file);
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}