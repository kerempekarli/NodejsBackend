const BaseService = require("./BaseService.js");
const BaseModel = require("../models/Projects")
class Projects extends BaseService {
    constructor(){
        super(BaseModel)
    }
}    

module.exports = Projects