import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import errorReducer from "./errorSlice";



const rootReducer = {
    cart: cartReducer,
    auth: authReducer,
    error: errorReducer
}
export default rootReducer;