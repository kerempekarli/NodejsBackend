const express = require("express");
const UserController = require("../controllers/Users");
const validate = require("../middlewares/validate")
const authenticate = require("../middlewares/authenticate")
const schemas = require("../validations/Users")



const router = express.Router();

router.route("/").get(authenticate, UserController.index);
router.route("/").post( validate(schemas.createValidation), UserController.create);
router.route("/").patch(authenticate,validate(schemas.updateValidation), UserController.update);
router.route("/login").post(validate(schemas.loginValidation), UserController.login)
router.route("/projects").get(authenticate, UserController.projectList);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), UserController.resetPassword);
router.route("/change-password").post(authenticate, validate(schemas.changePasswordValidation), UserController.changePassword);
router.route("/update-profile-image").post(authenticate, UserController.updateProfileImage);
router.route("/:id").delete(authenticate,UserController.deleteUser)
module.exports =  router
 