import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export default asyncHandler(async(req, res, next) => {
    const authorization = req.get("authorization");
    let token = ""
    if(authorization && authorization.toLowerCase().startsWith("bearer")){
        token = authorization.split(" ")[1];
    }
    if(!token) {
        res.status(401);
        throw new Error("Accesso Denegado");
    }
    //!Token decodificado con la palabra secreta
    try{
        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id).populate('shippingAddresses.regionId');
        //Biendolo bien, esta parte del cookie lo usaria si me funcionara la asignación de token cuando hago la peticion desde otro sitio pero no me deja, aqui si me deja por el hecho de que en el front mi proxy apunta back, o sea el front es como si estara apuntando hacia si mismo, entonces ahi mismo en el nvageador del frontend me esta guardado el cookie y no debería pasar eso, la cookie debería guardar en el navegador del server nada mas
        const isSameToken = token === req.cookies.jwt;
        if(!user || !isSameToken){
            res.status(401);
            throw new Error("Acceso Denegado");
        }
        req.user = user;
        return next();
    }catch(err){
        console.log(err);
        res.status(401);
        throw new Error("Token missing or invalid")
    }
})