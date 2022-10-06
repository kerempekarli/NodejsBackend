const express = require("express");
const ProjectController = require("../controllers/Project");
const validate = require("../middlewares/validate")
const  authenticate  = require("../middlewares/authenticate")
const schemas = require("../validations/Projects");
const router = express.Router();


router.route("/").get(ProjectController.index);
router.route("/").post(authenticate, validate(schemas.createValidation), ProjectController.create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), ProjectController.update)
router.route("/:id").delete(authenticate, ProjectController.deleteProject);


module.exports = router