import express from "express";
import * as PROFILE_CONTROLLER from "../controllers/profileController.js";
import * as PROFILE_VALIDATORS from "../validators/profileValidators.js";

import * as MIDDLEWARES from "../middlewares/index.js";

const Router = express();

Router.route("/").get(MIDDLEWARES.verifyAuthentication, PROFILE_CONTROLLER.getProfile);
Router.route("/").put(PROFILE_VALIDATORS.updateProfile, MIDDLEWARES.verifyAuthentication, PROFILE_CONTROLLER.updateProfile);
Router.route("/change-password").patch(PROFILE_VALIDATORS.updatePassword, MIDDLEWARES.verifyAuthentication, PROFILE_CONTROLLER.updatePassword);
Router.route("/add-shipping-address").post(PROFILE_VALIDATORS.addShippingAddress, MIDDLEWARES.verifyAuthentication, PROFILE_CONTROLLER.addShippingAddress);
Router.route("/change-selected-shipping-address").post(MIDDLEWARES.verifyAuthentication, PROFILE_CONTROLLER.changeSelectedShippingAddress);

export default Router;
