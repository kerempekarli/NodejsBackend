const express = require("express");
const { create,index,login, projectList,resetPassword,update,deleteUser, changePassword,updateProfileImage } = require("../controllers/Users");
const validate = require("../middlewares/validate")
const authenticate = require("../middlewares/authenticate")
const schemas = require("../validations/Users")



const router = express.Router();

router.route("/").get(authenticate, index);
router.route("/").post( validate(schemas.createValidation), create);
router.route("/").patch(authenticate,validate(schemas.updateValidation), update);
router.route("/login").post(validate(schemas.loginValidation), login)
router.route("/projects").get(authenticate, projectList);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/change-password").post(authenticate, validate(schemas.changePasswordValidation), changePassword);
router.route("/update-profile-image").post(authenticate, updateProfileImage);
router.route("/:id").delete(authenticate,deleteUser)
module.exports =  router
 