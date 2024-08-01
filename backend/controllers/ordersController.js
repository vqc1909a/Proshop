import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc Create a new Order
// @route POST /api/orders
// @access Private
export const saveOrder = asyncHandler(async (req, res) => {
    //Todo los datos del cart va en el pedido u orden
    const {items, qtyItems, itemsPrice, taxPrice, totalPrice, shippingAddress, paymentMethod} = req.body;
    const {city, country, postalCode} = shippingAddress?.regionId || {};

    let newFormatShippingAddress = {
        address: shippingAddress?.address,
        city: city,
        country: country,
        postalCode: postalCode
    }
    if(!items.length){
        res.status(404);
        throw new Error("Pedido sin artículos")
    }
    //Restar el stock de los productos
    const itemsPromise = items.map(item => {
        return Product.findById(item.id);
    })
    const itemsResult = await Promise.all(itemsPromise);

    const productsPromise = itemsResult.map(item => {
        const productId = item._id
        const searchedProduct = items.find(item => item.id.toString() === productId.toString())
        item.countInStock = item.countInStock - searchedProduct.qty
        return item.save();
    })
    await Promise.all(productsPromise)

    const order = new Order({
        userId: req.user._id,
        items: items.map(item => ({
            qty: item.qty,            
            productId: item.id
        })),
        qtyItems,
        shippingAddress: newFormatShippingAddress,
        paymentMethod,
        itemsPrice,
        totalPrice, 
        taxPrice,
        shippingPrice: (shippingAddress?.regionId?.shippingPrice || 0)
    })
    const createdOrder = await order.save();
    return res.status(200).json({body: createdOrder});
});

// @desc Fetch my orders
// @route GET /api/orders
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
    let orders = [];
    let totalOrders = 0;
    let page = Number(req.query.page) || 1;
    let ordersByPage = 5;
    let totalPages = 0;
    //Funciona con createdAt pero no con updatedAt

    orders = await Order.find({userId: req.user._id});
    totalOrders = orders.length;
    totalPages = Math.ceil(totalOrders/ordersByPage);
    
    
    Order.find({userId: req.user._id}).sort({ createdAt: -1 }).limit(ordersByPage).skip(ordersByPage * (page - 1));

    return res.status(200).json({body: {
        orders,
        totalOrders,
        page,
        ordersByPage,
        totalPages
    }});
});

// @desc Fetch order by ID
// @route GET /api/orders/:id
// @access Private/admin
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('userId', 'id name email').populate('items.productId');

    let isAdmin = req.user.isAdmin;
    let isOrderLoggedUser = (order.userId._id.toString() === req.user._id.toString());
    //Solo si soy un usuario normal verifico que el order sea mio y no de otra persona
    if(!isAdmin){
        if(!isOrderLoggedUser){
            res.status(401);
            throw new Error("Acceso Denegado");    
        }
    }
    if(!order){
        res.status(400);
        throw new Error("Order not found")
    }
    return res.status(200).json({body: order});
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private/Admin
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        res.status(400);
        throw new Error("Order not found")
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    //ESto es el objeto que me devuelve luego de que me haya creado el order en paypal => orderDetails
    // {
    //     "id": "5E116064HJ739660U",
    //     "intent": "CAPTURE",
    //     "status": "COMPLETED",
    //     "purchase_units": [
    //         {
    //             "reference_id": "default",
    //             "amount": {
    //                 "currency_code": "USD",
    //                 "value": "571.99"
    //             },
    //             "shipping": {
    //                 "name": {
    //                     "full_name": "John Doe"
    //                 },
    //                 "address": {
    //                     "address_line_1": "Free Trade Zone",
    //                     "admin_area_2": "Lima",
    //                     "admin_area_1": "Lima",
    //                     "postal_code": "07001",
    //                     "country_code": "PE"
    //                 }
    //             },
    //             "payments": {
    //                 "captures": [
    //                     {
    //                         "id": "4WL32502J72816338",
    //                         "status": "PENDING",
    //                         "status_details": {
    //                             "reason": "UNILATERAL"
    //                         },
    //                         "amount": {
    //                             "currency_code": "USD",
    //                             "value": "571.99"
    //                         },
    //                         "final_capture": true,
    //                         "seller_protection": {
    //                             "status": "NOT_ELIGIBLE"
    //                         },
    //                         "create_time": "2023-08-26T06:29:52Z",
    //                         "update_time": "2023-08-26T06:29:52Z"
    //                     }
    //                 ]
    //             }
    //         }
    //     ],
    //     "payer": {
    //         "name": {
    //             "given_name": "John",
    //             "surname": "Doe"
    //         },
    //         "email_address": "sb-k0zf32873041@personal.example.com",
    //         "payer_id": "A6JR6A7JEX9PY",
    //         "address": {
    //             "country_code": "PE"
    //         }
    //     },
    //     "create_time": "2023-08-26T06:29:42Z",
    //     "update_time": "2023-08-26T06:29:52Z",
    //     "links": [
    //         {
    //             "href": "https://api.sandbox.paypal.com/v2/checkout/orders/5E116064HJ739660U",
    //             "rel": "self",
    //             "method": "GET"
    //         }
    //     ]
    // }
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
    }
    const updatedOrder = await order.save();
    return res.status(200).json({body: updatedOrder, message: "Payment Successful"});
});

// @desc Update order to delivered
// @route GET /api/orders/:id/delivered
// @access Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        res.status(400)
        throw new Error("Order not found")
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    return res.status(200).json({body: updatedOrder, message: "Deliver Successful"})
    
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {

    let totalOrders = await Order.countDocuments();
    let page = Number(req.query.page) || 1;
    let ordersByPage = 5;
    let totalPages = Math.ceil(totalOrders/ordersByPage);

    //Funciona concreatedAt peor no con updatedAt
    let orders = await Order.find({}).populate('userId', 'id name email').populate('items.productId').sort({ createdAt: -1 }).limit(ordersByPage).skip(ordersByPage * (page - 1)) ;

    return res.status(200).json({body: {
        orders,
        totalOrders,
        page,
        ordersByPage,
        totalPages
    }});
});




