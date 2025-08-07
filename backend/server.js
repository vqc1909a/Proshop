import * as url from 'url';
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import asyncHandler from "express-async-handler";

//!Routes
import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import path from "path";

//!Middlewares
import * as MIDDLEWARES from "./middlewares/index.js";

dotenv.config({path: '.env'});

const app = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());


// No podemos poner nuestra identificación de cliente en la interfaz. No lo quieres del lado del cliente porque no quieres que la gente lo reciba. Entonces lo almacenamos en nuestro archivo Env y luego creamos una ruta para que PayPal pueda obtener esa ID de cliente y luego usarla.
app.get("/api/config/paypal", asyncHandler((req, res) => res.status(200).json({clientId: process.env.APP_PAYPAL_CLIENT_ID || ""})));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/profile", profileRoutes); 
app.use("/api/orders", ordersRoutes); 
app.use("/api/users", usersRoutes); 

//Ahoras si es que sabes bien que el build al igual que el developmentb de una aplicación de react es simplemente un html donde necesita javascript para ejecutar todo lo que hicimos en el front, o sea pintar las rutas en el navegador, responder el contenido según la ruta, etc y para deployarlo simplemente necesitamos de un servidor corriendo para mandar a llmar a ese html, lo hacemos desde este servidor del backend xq el proxy ya no me funcionara cuando hacemos le build de mi app de react porque es un simple html con el javascript ya compilado de todo lo que hicimos pero no me funcionara el proxy porque solamente me funcionara en modo desarrollo gracias al package.json


// This route serves the main HTML file to the browser.
// When a user visits your site (e.g., / or any frontend route), the server responds with index.html, which loads your React app in the browser.

// The "proxy" setting only works in development. In production, you need to serve the built frontend files yourself.

if(process.env.NODE_ENV === 'production'){
    //Para cualquier ruta desconocida tenemos que servir el index.html del build del frontend, esto xq vamos a tener rutas fictias del front y para que nos funcione como en el development cuando recargamos dichas paginas con las rutas fictias, entonces aqui debemos de poner cualquier ruta que no se encuentra definido en nuestro back, xq nuestro back todas sus retuas empiezan con /api, etonces funcionara normalin con las rutas del front, solamente que no deben coincidir las rutas del front con el del back

    //En un principio no te va a dar xq solamente estas accediendo al html pero no tienes acceso a los recursos de toda la carpeta build xq solamente estas sirviendo el index.html del front nada mas, y no todos los demás recurosso, para ello podemos hacerlo publico desde este servidor de node todo lo que esta dentro del build del front
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get("/", function(req, res){
        return res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    })

}else{
    app.get("/", (req, res) => {
        return res.send("API is running");
    })
}

app.use(MIDDLEWARES.notFoundMiddleware);
app.use(MIDDLEWARES.errorMiddleware);

connectDB()
    .then(res => {
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        })
    })

