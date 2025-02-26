import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    // Método para buscar por ID. Agregados para test funcional
    async findById(petId) {
        try {
            return await this.dao.findById(petId);  // Suponiendo que "dao" tiene el método findById
        } catch (error) {
            throw new Error("Error al buscar la mascota: " + error.message);
        }
    }

    // Método para eliminar por ID. Idem
    async delete(petId) {
        try {
            return await this.dao.deleteOne({ _id: petId });  // Suponiendo que "dao" tiene el método deleteOne
        } catch (error) {
            throw new Error("Error al eliminar la mascota: " + error.message);
        }
    }
}