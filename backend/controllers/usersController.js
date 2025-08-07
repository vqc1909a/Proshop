import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import bcrypt from "bcryptjs";


// @desc    Fetch All Users
// @route   GET /api/users/admin
// @access  Private
export const getUsers = asyncHandler( async(req, res) => {
    const user = req.user;
    
    let page = Number(req.query.page) || 1;
    let users = []
    let totalUsers = 0;
    let usersByPage = 5;
    let totalPages = 0;

    let useSuperAdmin = await User.findOne({isSuperAdmin: true});
    
    //Gestionar tu propia cuenta para todos los admins, pero como superadmin puedes gestionar las cuentas de los admins, pero el admin no puede gestionar la cuenta del superadmin
    if(user.isSuperAdmin){
        users =  await User.find({}).select("-password -shippingAddresses");
        totalUsers = users.length;
        totalPages = Math.ceil(totalUsers / usersByPage);
        users =  await User.find({}).select("-password -shippingAddresses").sort({ createdAt: -1 }).limit(usersByPage).skip(usersByPage * (page - 1));
    }else{
        users =  await User.find({_id: {$ne: useSuperAdmin._id}}).select("-password -shippingAddresses");
        totalUsers = users.length;
        totalPages = Math.ceil(totalUsers / usersByPage)
        users =  await User.find({_id: {$ne: useSuperAdmin._id}}).select("-password -shippingAddresses").sort({ createdAt: -1 }).limit(usersByPage).skip(usersByPage * (page - 1));
    }
    return res.status(200).json({body: {
        users,
        totalUsers,
        page,
        usersByPage,
        totalPages
    }});
})

// @desc    Fetch User By Id
// @route   GET /api/users/admin/:id
// @access  Private
export const getUserById = asyncHandler( async(req, res) => {
    const userId = req.params.id;

    //No debemos de ver el password de nuestro usuarios pero si lo podemos cambiar 
    const user = await User.findOne({_id: userId}).select("-password -shippingAddresses");
    if(!user){
        res.status(404);
        throw new Error("El usuario no existe");
    }
    return res.status(200).json({body: user});
})

// @desc    Create User
// @route   POST /api/users/admin/:id
// @access  Private
export const createUser = asyncHandler( async(req, res) => {
    const body = req.body;
    const user = await User.findOne({email: body.email});
    if(user){   
        res.status(400);
        throw new Error("El usuario ya se encuentra registrado");
    }
    const savedProduct = await User.create(body);
    return res.status(200).json({
        body: savedProduct,
        message: "Usuario creado correctamente"
    }) 
})

// @desc    Update User by id
// @route   UPDATE /api/users/admin/:id
// @access  Private
export const updateUser = asyncHandler( async(req, res) => {
    const userId = req.params.id;
    const body = req.body;

    const searchedUser = await User.findOne({_id: {$ne: userId}, email: body.email});
    if(searchedUser){
        res.status(400);
        throw new Error("El correo ya se encuentra registrado")
    }

    const user = await User.findOne({_id: userId}).select("-password -shippingAddresses");
    if(!user){
        res.status(404);
        throw new Error("El usuario no existe");
    }

    const updatedUser = await User.findOneAndUpdate({_id: userId}, body, {runValidators: true, new: true})
    return res.status(200).json({body: updatedUser, message: "Usuario Actualizado Correctamente"});
})

//Aqui tendríamos que ver acerca de la integridad referencial

// @desc    Delete User
// @route   DELETE /api/users/admin/:id
// @access  Private
export const deleteUser = asyncHandler( async(req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({_id: userId}).select("-password -shippingAddresses");
    if(!user){
        res.status(404);
        throw new Error("El usuario no existe");
    }

    //Verificar que no tengamos algun orden vinculado al usuario
    const orders = await Order.find({});
    let existsUserInSomeOrder = orders.some(order => order.userId.toString() === userId.toString());
    
    if(existsUserInSomeOrder){
        res.status(400);
        throw new Error("El usuario tiene ordenes vinculados")
    }

    //Verificar que no tengamos algun producto vinculado al usuario
    const products = await Product.find({});
    let existsUserInSomeProduct = products.some(order => order.userId.toString() === userId.toString());
    
    if(existsUserInSomeProduct){
        res.status(400);
        throw new Error("El usuario tiene productos vinculados")
    }

    //Verificar que no tengamos alguna reseña vinculado al usuario
    const reviews = await Review.find({});
    let existsUserInSomeReview = reviews.some(review => review.userId.toString() === userId.toString());
    
    if(existsUserInSomeReview){
        res.status(400);
        throw new Error("El usuario tiene reseñas vinculados")
    }
    
    const deleteUserPromise = User.deleteOne({_id: userId});
    const deleteOrdersPromise = Order.deleteMany({userId});
    const deleteProductsPromise = Product.deleteMany({userId});
    const deleteReviewsPromise = Review.deleteMany({userId});

    const [deleteUserResult, deleteOrdersResult, deleteProductsResult, deleteReviewsResult] = await Promise.all([deleteUserPromise, deleteOrdersPromise, deleteProductsPromise, deleteReviewsPromise]);

    console.log({
        deleteUserResult,
        deleteOrdersResult,
        deleteProductsResult,
        deleteReviewsResult
    })
    return res.status(200).json({
        message: "Usuario eliminado correctamente"
    })
})

