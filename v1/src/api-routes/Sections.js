const express = require("express");
const SectionController = require("../controllers/Section");
const validate = require("../middlewares/validate")
const  authenticate  = require("../middlewares/authenticate")
const schemas = require("../validations/Sections");
const router = express.Router();
const idChecker = require("../middlewares/idChecker")

router.route("/:projectId").get(authenticate, SectionController.index);
router.route("/").post(authenticate, validate(schemas.createValidation), SectionController.create);
router.route("/:id").patch(idChecker(),authenticate, validate(schemas.updateValidation), SectionController.update)
router.route("/:id").delete(idChecker(),authenticate, SectionController.deleteSection);


module.exports = router