import express from "express";

import * as AUTH_VALIDATORS from "../validators/authValidators.js";
import * as AUTH_CONTROLLER from "../controllers/authController.js";
import * as MIDDLEWARES from "../middlewares/index.js";
const Router = express();

Router.route("/register").post(AUTH_VALIDATORS.register ,AUTH_CONTROLLER.register); 
Router.route("/login").post(AUTH_VALIDATORS.login, AUTH_CONTROLLER.login);
Router.route("/logout").post(MIDDLEWARES.verifyAuthentication, AUTH_CONTROLLER.logout);

export default Router;
