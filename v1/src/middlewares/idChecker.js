const httpStatus = require("http-status")
const ApiError = require("../Errors/apiError")
const idChecker = (field) => (req,res,next) => {

    if(!req?.params[field || "id"]?.id?.match(/^[0-9a-fA-F]{24}$/)){
        return next(new ApiError("Lütfen geçerli bir ID bilgisi giriniz",400));
        
    }
    next()
}

module.exports = idChecker