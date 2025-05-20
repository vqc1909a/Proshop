import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: '.env'});

const db_uri = process.env.NODE_ENV === "production" ? process.env.DB_URI : process.env.DB_URI_DEV;

const connectDB = async () => {
    try{
        const db = await mongoose.connect(db_uri, {
            useNewUrlParser: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
            useUnifiedTopology: true,     
        })
        console.log(`DB Connected to ${db.connection.host}`)  
    }catch(err){
        console.error("DB Connection Error", err);
        process.exit(1);
    }
}
export default connectDB