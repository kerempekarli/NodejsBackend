const express = require("express");
const { create,index,update,deleteSection } = require("../controllers/Sections");
const validate = require("../middlewares/validate")
const  authenticate  = require("../middlewares/authenticate")
const schemas = require("../validations/Sections");
const router = express.Router();

router.route("/:projectId").get(authenticate, index);
router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update)
router.route("/:id").delete(authenticate, deleteSection);


module.exports = router