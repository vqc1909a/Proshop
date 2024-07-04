import * as url from 'url';
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import multer from "multer";
import path from "path"
import { storageProducts } from "../config/multer.js";
import fse from "fs-extra";
import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const upload = (fieldName) => {
    return multer({
        storage: storageProducts,
        limits: {
            fileSize: 1024 * 1024, // 1 MB
            fieldSize: 1024 * 1024,
            files: 1 // Máximo 1 archivo
        }
    }).single(fieldName);
};

export const subirImagen = (fieldName) => {
    return (req, res, next) => {
        upload(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({ message: "El tamaño de la imagen debe ser como máximo de 1MB" });
                } else {
                    return res.status(400).json({ message: err.message });
                }
            } else if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    };
};

// @desc Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
    let totalProducts = await Product.countDocuments();
    let page = Number(req.query.page) || 1;
    let productsByPage = 4;
    let totalPages = Math.ceil(totalProducts/productsByPage);

    //Funciona concreatedAt peor no con updatedAt
    let products = await Product.find({}).sort({ createdAt: -1 }).skip(productsByPage * (page - 1)).limit(productsByPage);
    return res.status(200).json({body: {
        products,
        totalProducts,
        page,
        productsByPage,
        totalPages
    }});
});

// @desc Fetch product by keyword
// @route GET /api/products/search/:keyword
// @access Public
export const getProductsBySearch = asyncHandler(async(req, res) => {
    let keyword = req.params.keyword || undefined;
    let page = Number(req.query.page) || 1;
    
    let products = [];
    let totalProducts = 0;
    let productsByPage = 8;
    let totalPages = 0;

    products = await Product.find({
        $or: [
            {name: {$regex: new RegExp(keyword, 'i')}},
            {brand: {$regex: new RegExp(keyword, 'i')}}, 
            {category: {$regex: new RegExp(keyword, 'i')}}, 
            {description: {$regex: new RegExp(keyword, 'i')}}
        ]
    });
    totalProducts = products.length;
    totalPages = Math.ceil(totalProducts/productsByPage);

    products = await Product.find({
        $or: [
            {name: {$regex: new RegExp(keyword, 'i')}},
            {brand: {$regex: new RegExp(keyword, 'i')}}, 
            {category: {$regex: new RegExp(keyword, 'i')}}, 
            {description: {$regex: new RegExp(keyword, 'i')}}
        ]
    }).sort({ createdAt: -1 }).skip(productsByPage * (page - 1)).limit(productsByPage);

    return res.status(200).json({body: {
        products,
        totalProducts,
        page,
        productsByPage,
        totalPages
    }});
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
export const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);
    return res.status(200).json({body: products});
});

// @desc Fetch product by slug
// @route GET /api/products/:slug
// @access Public
export const getProductBySlug = asyncHandler(async(req, res) => {
    // try{
        const {slug} = req.params;
        const product = await Product.findOne({slug}).populate("userId");
        if(!product){
            res.status(404);
            throw new Error("Producto no encontrado");
        }
        return res.status(200).json({body: product});
    // }catch(err){
    //     console.log(err.statusCode, err.message)
        //! Lo que me bota para el producto no encontrado
//         200
// [0] undefined Producto no encontrado
//!Lo que me bota po error de librería de terceros
// 200
// [0] undefined Cast to ObjectId failed for value "624cdadad3e065d737e8d32z" (type string) at path "_id" for model "Product"
//!Lo que me bota por error interno del servidor
// 200
// [0] undefined Product.fin is not a function

//!A hora entinedo porque midu ponia el err.status || 500

        // next(err)
    // }
});

// @desc Fetch Admin Products
// @route GET /api/products/admin
// @access Private/Admin
export const getProductsAdmin = asyncHandler(async (req, res) => {
    let user = req.user;

    let page = Number(req.query.page) || 1;
    let products = [];
    let totalProducts = 0;
    let productsByPage = 5;
    let totalPages = 0;

    //Cuando soy superadministrador necesito datos de los creadores del producto para mapearlos en el dashboard (owner)
    if(user.isSuperAdmin){
        products = await Product.find({});
        totalProducts = products.length;
        totalPages = Math.ceil(totalProducts/productsByPage);
        products = await Product.find({}).sort({ createdAt: -1 }).populate("userId").skip(productsByPage * (page - 1)).limit(productsByPage);
    }else{
        products = await Product.find({userId: user._id});
        totalProducts = products.length;
        totalPages = Math.ceil(totalProducts/productsByPage);
        products = await Product.find({userId: user._id}).sort({ createdAt: -1 }).skip(productsByPage * (page - 1)).limit(productsByPage);
    }
    
    return res.status(200).json({body: {
        products,
        totalProducts,
        page,
        productsByPage,
        totalPages
    }});
});

// @desc Fetch Product by id
// @route GET /api/products/admin/:id
// @access Private/Admin
export const getProductById = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if(!product){
        res.status(404);
        throw new Error("Producto no encontrado");
    }
    return res.status(200).json({body: product});
});

// @desc Create a Product
// @route POST /api/products/admin
// @access Private/Admin
export const createProduct = async (req, res, next) => {
    const body = req.body;
    body.userId = req.user._id;
    if(req.file){
        body.image = `/dist/uploads/products/${req.file.filename}`
    }
    try{   
        const savedProduct = await Product.create(req.body);
        return res.status(200).json({
            body: savedProduct,
            message: "Producto creado correctamente"
        }) 
    }catch(err){
      //Si hay algun error, pues obviamente borramos el archivo subido
      const filePathImagen = path.join(__dirname, `../public/${body.image}`);
      if(fse.existsSync(filePathImagen)){
          fse.unlinkSync(filePathImagen);
      }
      return next(err);
  }
};

// @desc Edit a Product
// @route PUT /api/products/admin/:id
// @access Private/Admin
export const editProduct = asyncHandler(async(req, res, next) => {
    const idProduct = req.params.id;
    const user = req.user;
    const body = req.body;
    // body.userId = req.user._id;
    if(user.isSuperAdmin){
        const searchedProduct = await Product.findOne({_id: idProduct});
        if(!searchedProduct){
            res.status(400);
            throw new Error("Producto no encontrado")
        }        
    }else{
        const searchedProduct = await Product.findOne({_id: idProduct, userId: user._id});
        if(!searchedProduct){
            res.status(401);
            throw new Error("Acción denegada")
        }
    }
    const updatedProduct = await Product.findOneAndUpdate({_id: idProduct}, body, {runValidators: true, new: true});
    return res.status(200).json({message: "Producto editado correctamente", body: updatedProduct});
});

// @desc Edit a Image Product
// @route PUT /api/products/admin/:id/change-image
// @access Private/Admin
export const editImageProduct = async(req, res, next) => {
    const idProduct = req.params.id;
    const body = req.body;
    const user = req.user;
    if(req.file){
        body.image = `/dist/uploads/products/${req.file.filename}`
    }
    try{   
        let searchedProduct;
        if(user.isSuperAdmin){
            searchedProduct = await Product.findOne({_id: idProduct});
            if(!searchedProduct){
                res.status(400);
                throw new Error("Producto no encontrado")
            }        
        }else{
            searchedProduct = await Product.findOne({_id: idProduct, userId: user._id});
            if(!searchedProduct){
                res.status(401);
                throw new Error("Acción denegada")
            }
        }

        let previousImage = searchedProduct.image;

        //Si me actualizo la ruta de la imagen correctamente, entonces eliminamos la imagen anterior
        const updatedProduct = await Product.findOneAndUpdate({_id: idProduct}, body, {runValidators: true, new: true});

        const filePathImage = path.join(__dirname, `../public/${previousImage}`);
        if(fse.existsSync(filePathImage) && body.image){
            fse.unlinkSync(filePathImage);
        }

        return res.status(200).json({
            body: updatedProduct,
            message: "Imagen del Producto cambiado correctamente"
        }) 
    }catch(err){
        //Si hay algun error, pues obviamente borramos el archivo subido
        const filePathImagen = path.join(__dirname, `../public/${body.image}`);
        if(fse.existsSync(filePathImagen)){
            fse.unlinkSync(filePathImagen);
        }
        return next(err);
    }
};

// @desc Delete a Product
// @route DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async(req, res, next) => {
    const idProduct = req.params.id;
    const user = req.user;
    
    let searchedProduct
    if(user.isSuperAdmin){
        searchedProduct = await Product.findOne({_id: idProduct});
        if(!searchedProduct){
            res.status(400);
            throw new Error("Producto no encontrado")
        }        
    }else{
        searchedProduct = await Product.findOne({_id: idProduct, userId: user._id});
        if(!searchedProduct){
            res.status(401);
            throw new Error("Acción denegada")
        }
    }

    //Verificar que no tengamos algun orden vinculado al producto
    const orders = await Order.find({});
    let existsProductInSomeOrder = false;
    orders.forEach((order) => {
        let existsProduct = order.items.some(item => item.productId.toString() === idProduct.toString());
        if(existsProduct){
            existsProductInSomeOrder = true;
        }
    })
    if(existsProductInSomeOrder){
        res.status(400);
        throw new Error("El producto tiene ordenes vinculados")
    }

    let previousImage = searchedProduct.image;
    //Me devuelve el objeto eliminado
    const deleteProductPromise = Product.findOneAndDelete({_id: idProduct});
    const deleteReviewsPromise =  Review.deleteMany({productId: idProduct});

    const [deleteProductResult, deleteReviewsResult] = await Promise.all([deleteProductPromise, deleteReviewsPromise]);

    console.log({
        deleteProductResult,
        deleteReviewsResult
    })
    const filePathImage = path.join(__dirname, `../public/${previousImage}`);
    if(fse.existsSync(filePathImage)){
        fse.unlinkSync(filePathImage);
    }

    return res.status(200).json({
        body: deleteProductResult,
        message: "Producto eliminado correctamente"
    }) 
});


// @desc    Get reviews of product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getReviews = asyncHandler( async(req, res) => {
    const productId = req.params.id;
    const reviews = await Review.find({productId}).populate("userId productId");
    return res.status(200).json({body: reviews})
})


// @desc    Create a review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler( async(req, res) => {
    const user = req.user;
    const productId = req.params.id;
    const body = req.body;

    const product = await Product.findOne({_id: productId});
    if(!product){
        res.status(400);
        throw new Error("Producto no encontrado")
    }

    //Solo puedes hacer critica del producto una sola vez
    const reviews = await Review.find({productId});
    const alreadyReviewed = reviews.find(review => review.userId.toString() === user._id.toString());
    if(alreadyReviewed){
        res.status(400);
        throw new Error("Product already reviewed");
    }

    const review = {
        userId: user._id,
        productId,
        comment: body.comment,
        rating: Number(body.rating)
    }
    await Review.create(review);

    //Otra vez solicitamos los reviews;
    const newReviews = await Review.find({productId});

    //Una vez creado el review, actualizamos los datos del producto
    const bodyProduct = {
        numReviews: newReviews.length,
        rating: parseFloat(newReviews.reduce((acc, review)  => acc + review.rating, 0) / newReviews.length).toFixed(2),
    }
    const updatedProduct = await Product.findOneAndUpdate({_id: productId}, bodyProduct, {runValidators: true, new: true});
    return res.status(200).json({message: "Review added", body: updatedProduct})
})



