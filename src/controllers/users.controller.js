import { usersService } from "../services/index.js"

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}


/*const updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    const updatedUser = await usersService.update(userId, updateBody);
    res.send({ status: "success", payload: updatedUser }); // Se devuelve el usuario actualizado
};*/

const updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;

    if (!updateBody.first_name || typeof updateBody.first_name !== 'string') {
        return res.status(400).send({ status: "error", error: "Invalid data" });
    }

    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    const updatedUser = await usersService.update(userId, updateBody);
    res.send({ status: "success", payload: updatedUser }); // Se devuelve el usuario actualizado
};



const deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await usersService.delete(userId); //  usersService debe tener un método delete
    res.send({ status: "success", message: "Usuario eliminado correctamente" });
};



export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}