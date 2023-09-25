import express from "express";
import * as ORDERS_CONTROLLER from "../controllers/ordersController.js";
import * as MIDDLEWARES from "../middlewares/index.js";

const Router = express();

Router.route("/").get(MIDDLEWARES.verifyAuthentication, ORDERS_CONTROLLER.getMyOrders);
Router.route("/").post(MIDDLEWARES.verifyAuthentication, ORDERS_CONTROLLER.saveOrder);
Router.route("/admin").get(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, ORDERS_CONTROLLER.getAllOrders);

Router.route("/:id").get(MIDDLEWARES.verifyAuthentication, ORDERS_CONTROLLER.getOrderById);
Router.route("/:id/pay").put(MIDDLEWARES.verifyAuthentication, ORDERS_CONTROLLER.updateOrderToPaid);
Router.route("/:id/deliver").put(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, ORDERS_CONTROLLER.updateOrderToDelivered);


export default Router;
