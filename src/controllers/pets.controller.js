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

const createPet = async(req,res)=> {
    //const {name,specie,birthDate} = req.body; Controles originales
    //if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    
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
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId,petUpdateBody);
    res.send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({status:"success",message:"pet deleted"});
}

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