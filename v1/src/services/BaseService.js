let BaseModel = null;



class BaseService {
    list(where){
        return BaseModel?.find(where);
    }
    create(data){}
    read(where){}
    update(id,data){}
    delete(id){}
}

module.exports = BaseService