const express = require("express");
const { create,index,update,deleteProject } = require("../controllers/Project");
const validate = require("../middlewares/validate")
const  authenticate  = require("../middlewares/authenticate")
const schemas = require("../validations/Projects");
const router = express.Router();

router.route("/").get(index);
router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update)
router.route("/:id").delete(authenticate, deleteProject);


module.exports = router