import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export default asyncHandler(async(req, res, next) => {
    if(!req.user || !req.user.isAdmin){
        res.status(401);
        throw new Error("Acceso Denegado");
    }
    return next();
})