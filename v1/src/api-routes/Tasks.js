const express = require("express");
const TaskController = require("../controllers/Tasks");
const validate = require("../middlewares/validate")
const  authenticate  = require("../middlewares/authenticate")
const schemas = require("../validations/Tasks");
const router = express.Router();

router.route("/").post(authenticate, validate(schemas.createValidation), TaskController.create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), TaskController.update)
router.route("/:id/make-comment").post(authenticate, validate(schemas.commentValidation), TaskController.makeComment)
router.route("/:id/add-sub-task").post(authenticate, validate(schemas.createValidation), TaskController.addSubtask)
router.route("/:id/:commendId").delete(authenticate, TaskController.deleteComment)
router.route("/:id").delete(authenticate,TaskController.deleteTask);
router.route("/:id").get(authenticate, TaskController.fetchTask);


module.exports = router