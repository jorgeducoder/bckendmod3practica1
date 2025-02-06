import userModel from "./models/User.js";


export default class Users {
    
    get = (params) =>{
        return userModel.find(params);
    }

    getBy = (params) =>{
        return userModel.findOne(params);
    }

    save = (doc) =>{
        return userModel.create(doc);
    }

    update = (id,doc) =>{
        return userModel.findByIdAndUpdate(id,{$set:doc}, { new: true, runValidators: true });
    }

    delete = (id) =>{
        return userModel.findByIdAndDelete(id);
    }
}

/*import userModel from "./models/User.js";

export default class Users {
    async getBy(query) {
        return await userModel.findOne(query);
    }

    async update(id, updateBody) {
        return await userModel.findByIdAndUpdate(id, updateBody, { new: true, runValidators: true });
    }
}*/
