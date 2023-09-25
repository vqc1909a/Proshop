import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import GeographicRegion from "../models/geographicRegionModel.js";

import { nanoid } from 'nanoid';


//En este caso lo estmoas haciendo de forma general en todo el mundo y el precio se basa la tabla de la regionId, si fuera solo de Perú esto variaría, mas que nada los campo de regionId y los precios también
const SHIPPING_ADDRESSES = [
  {
    id: nanoid(),
    address: "Calle Paseo Los Vencedores Mz. I LT. 4",
    isSelected: true,
    regionId: {
      country: "Perú",
      city: "Pasco",
      postalCode: "19001",
      shippingPrice: 100
    }
  },
  {
    id: nanoid(),
    address: "Calle Mariscal Castilla Mz. 200 Lt. 4",
    isSelected: false,
    regionId: {
      country: "Perú",
      city: "Lima",
      postalCode: "20002",
      shippingPrice: 50
    }
  }
]

// @desc Fetch profile
// @route GET /api/profile
// @access Private
export const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({body: req.user});
});

// @desc Update profile
// @route PUT /api/profile
// @access Private
export const updateProfile =  asyncHandler(async (req, res) => {
    const user = req.user;

    const {name, email} = req.body;
    //Me hace una busqueda de si el correo ya lo tiene otro usuario aparte de mi
    const searchedUser = await User.findOne({_id: {$ne: user._id}, email});
    if(searchedUser){
        res.status(400);
        throw new Error("El correo ya se encuentra registrado")
    }
    //Si actualizas también el correo, tienes que hacer la validación por su correo
    const updatedUser = await User.findOneAndUpdate({_id: user.id}, {name, email}, {runValidators: true, new: true});
    return res.status(200).json({message: "Datos guardados correctamente", body: updatedUser});
});

// @desc Change Password
// @route PATCH /api/profile/change-password
// @access Private
export const updatePassword = asyncHandler(async (req, res) => {
    const user = req.user;
    const {current_password, new_password, confirm_new_password} = req.body;
    
    //Verificamos si el password actual ingresado coincide con mi password que tengo ahora mismo antes de cambiarlo
    if(!user.verifyPassword(current_password)){
        res.status(400);
        throw new Error("El password actual es incorrecto");
    }
    if(new_password !== confirm_new_password){
        res.status(400);
        throw new Error("Los nuevos passwords deben coincidir");
    }
    user.password = new_password;
    await user.save();

    return res.status(200).json({message: "Password actualizado correctamente"});
});

// @desc Add Shipping Address
// @route POST /api/profile/add-shipping-address
// @access Private
export const addShippingAddress = asyncHandler(async (req, res) => {
    const user = req.user;
    const body = req.body
    const { address, city, postalCode, country } = body;
    let searchedRegionId = await GeographicRegion.findOne({country, postalCode, city});
    
    //Asi sería si tuvieramos todas las regiones greographicas
    // if(!searchedRegionId){
    //   res.status(400);
    //   throw new Error("Ingrese una dirección válida");
    // }

    //Si no encuentra la region geografico que tome el valor Aleatorio, esto por mientras, para un verdadero ecommerce lo que tendrías que hacer es contactar con la empresa logística y que te provea como maneja los precios de envio y eso lo integras a tu aplicaión, porque ellos si sabran como calcular los precios según el lugar y el peso del producto
    if(!searchedRegionId){
      searchedRegionId = await GeographicRegion.findOne({country: "Aleatorio"});
    }

    //Establecemos el estado  de seleccionado a false de todas las direcciones antes de agregar la nueva direccion
    if(user.shippingAddresses.length){
      user.shippingAddresses.forEach(shipping => {
        shipping.isSelected = false;
      })
    }
    //Siempre que agregamos una nueva dirección ese es el nuevo seleccionado
    const shippingAddress = {
      address,
      isSelected: true,
      regionId: searchedRegionId.id
    }
    user.shippingAddresses.push(shippingAddress);
    await user.save();

    //Volvemos hacer la petición para que nos traiga los datos vinculados
    const againUser = await User.findById(user._id).populate('shippingAddresses.regionId');
    return res.status(200).json({body: againUser.shippingAddresses, message: "Shipping Address añadido exitosamente"});
});

// @desc Change Selected Shipping Address
// @route POST /api/profile/change-selected-shipping-address
// @access Private
export const changeSelectedShippingAddress = asyncHandler(async (req, res) => {
    const user = req.user;
    const idSelectedShippingAddress = req.body.idSelectedShippingAddress;

    user.shippingAddresses.forEach(shipping => {
      //DEseleccionar el anterior
      if(shipping.isSelected){
        shipping.isSelected = false;
      }
      //Seleccionar el nuevo
      if(shipping._id.toString() === idSelectedShippingAddress.toString()){
        shipping.isSelected = true;
      }
    });
    await user.save();

    return res.status(200).json({body: user.shippingAddresses, message: "Shipping Address cambiado correctamente"});
});
