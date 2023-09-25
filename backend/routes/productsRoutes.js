import express from "express";
import * as PRODUCTS_CONTROLLER from "../controllers/productsController.js";
import * as MIDDLEWARES from "../middlewares/index.js";
const Router = express();

Router.route("/").get(PRODUCTS_CONTROLLER.getProducts);
Router.route("/top").get(PRODUCTS_CONTROLLER.getTopProducts);

Router.route("/search/:keyword").get(PRODUCTS_CONTROLLER.getProductsBySearch);

Router.route("/admin").get(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, PRODUCTS_CONTROLLER.getMyProducts);
Router.route("/admin").post(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, PRODUCTS_CONTROLLER.subirImagen('image'), PRODUCTS_CONTROLLER.createProduct);
Router.route("/admin/:id").get(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware,PRODUCTS_CONTROLLER.getProductById);
Router.route("/admin/:id").put(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, PRODUCTS_CONTROLLER.editProduct);
Router.route("/admin/:id").delete(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, PRODUCTS_CONTROLLER.deleteProduct);
Router.route("/admin/:id/change-image").put(MIDDLEWARES.verifyAuthentication, MIDDLEWARES.adminMiddleware, PRODUCTS_CONTROLLER.subirImagen('newImage'), PRODUCTS_CONTROLLER.editImageProduct);

Router.route("/:slug").get(PRODUCTS_CONTROLLER.getProductBySlug);

Router.route("/:id/reviews").get(PRODUCTS_CONTROLLER.getReviews);
Router.route("/:id/reviews").post(MIDDLEWARES.verifyAuthentication, PRODUCTS_CONTROLLER.createReview);

export default Router