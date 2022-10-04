let BaseModel = null;

class BaseService {

    constructor(model){
        BaseModel = model
    }
    list(where){
        return BaseModel?.find(where);
    }
    create(data){
        return new BaseModel(data).save();
    }
    findOne(where){
        return BaseModel.findOne()
    }
    update(id,data){
        return BaseModel.findByIdAndUpdate(id,data,{new :true});
    }
    updateWhere(where,data){
        return BaseModel.findOneAndUpdate(where,data,{new: true})
    }
    delete(id){
        return BaseModel.findByIdAndDelete(id);
    }
}

module.exports = BaseService