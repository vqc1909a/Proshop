//Aqui utilizamos dotenv xq no los estamos ejeecutando dentro del server donde instanciamos el dotenv
import dotenv from "dotenv";
import colors from "colors";

//!Models
import User from "./models/userModel.js";
import Order from "./models/orderModel.js";
import Product from "./models/productModel.js";
import Review from "./models/reviewModel.js";
import GeographicRegion from "./models/geographicRegionModel.js";


//!Data
import users from "./data/users.js";
import products from "./data/products.js";
import geographicRegions from "./data/geographicRegions.js";


//!DB
import connectDB from "./config/db.js";

dotenv.config();

const importData = async () => {
    try{
        await Promise.all([Order.deleteMany(), User.deleteMany(), Product.deleteMany(), GeographicRegion.deleteMany(), Review.deleteMany()])
        
        const createdUsers =  await User.insertMany(users);
        
        // Aqui relacionamos los productos al id del admin que solamente el los puede crear
        const idAdminUser = createdUsers[0]._id;

        const newProducts = products.map(product => ({...product, userId: idAdminUser}))
        await Product.insertMany(newProducts);

        //Aqui creamos las regiones o zonas geograficas que tendran el precio de envio
        await GeographicRegion.insertMany(geographicRegions);
        console.log('Data Imported!'.green.inverse);
        process.exit(0);
    }catch(err){
        console.log(`${err}`.grey.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try{
        await Promise.all([Order.deleteMany(), User.deleteMany(), Product.deleteMany(), GeographicRegion.deleteMany(), Review.deleteMany()])

        console.log('Data Destroyed!'.green.inverse);
        process.exit(0);
    }catch(err){
        console.log(`${err}`.grey.inverse);
        process.exit(1);
    }
}

connectDB().then(() => {
    if(process.argv[2] === '-d'){
        destroyData();
    }else{
        importData();
    }
});






