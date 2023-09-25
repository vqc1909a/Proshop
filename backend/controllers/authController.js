
// Ten en cuenta que maxAge calcula el tiempo relativo y expires establece una fecha y hora exacta.

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user || !user.verifyPassword(password)){
        res.status(401);
        throw new Error("Usuario o Password Incorrecto");
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    //Biendolo bien, esta parte del cookie lo usaria si me funcionara la asignación de token cuando hago la peticion desde otro sitio pero no me deja, aqui si me deja por el hecho de que en el front mi proxy apunta back, o sea el front es como si estara apuntando hacia si mismo, entonces ahi mismo en el nvageador del frontend me esta guardado el cookie y no debería pasar eso, la cookie debería guardar en el navegador del server nada mas
    res.cookie('jwt', token, {
        httpOnly: true, // Permite que el cliente pueda leer la cookie solo desde el servidor para incluir el token CSRF en las solicitudes y no desde el navegador (javascript), o sea leer su contenido de la cookie solo desde el servidor y no desde el navegador. Esto ayuda a prevenir ataques de robo de cookies mediante scripts maliciosos.
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: 'strict', // Solo envía la cookie a través de solicitudes del mismo sitio
        maxAge: 1000 * 60 * 60
    })
    return res.status(200).json({body: token})
})

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req, res) => {
    const {email, password, confirm_password} = req.body;
    const user = await User.findOne({email});
    if(user){   
        res.status(400);
        throw new Error("El usuario ya se encuentra registrado");
    }
    if(password !== confirm_password){
        res.status(400);
        throw new Error("La confirmación de password debe coincidir");
    }
    const savedUser = await User.create(req.body)
    const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.cookie('jwt', token, {
        httpOnly: true, // Permite que el cliente pueda leer la cookie solo desde el servidor para incluir el token CSRF en las solicitudes y no desde el navegador (javascript), o sea leer su contenido de la cookie solo desde el servidor y no desde el navegador. Esto ayuda a prevenir ataques de robo de cookies mediante scripts maliciosos.
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: 'strict', // Solo envía la cookie a través de solicitudes del mismo sitio
        maxAge: 1000 * 60 * 60
    })
    return res.status(201).json({
        body: token
    })
})


// @desc Logout user
// @route POST /api/auth/logout
// @access Private

//Esto solo lo usaría si trabajaría solo con el cookie pero como es un medio de verificación en el front no lo uso
export const logout = asyncHandler(async(req, res, next) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        maxAge: 0
    });

    res.status(200).json({message: "Logged out successfully"})
})


