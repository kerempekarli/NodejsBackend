const express = require("express");
const { create,index,update,deleteTask,makeComment,deleteComment } = require("../controllers/Tasks");
const validate = require("../middlewares/validate")
const  authenticate  = require("../middlewares/authenticate")
const schemas = require("../validations/Tasks");
const router = express.Router();

router.route("/:taskId").get(authenticate, index);
router.route("/").post(authenticate, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), update)
router.route("/:id/make-comment").post(authenticate, validate(schemas.commentValidation), makeComment)
router.route("/:id/:commendId").delete(authenticate, deleteComment)
router.route("/:id").delete(authenticate, deleteTask);


module.exports = router