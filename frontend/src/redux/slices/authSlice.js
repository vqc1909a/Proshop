import {createAsyncThunk ,createSlice} from "@reduxjs/toolkit";
import * as CART_ACTIONS from "./cartSlice";

const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : "";
const isLogged = token ? true : false;

//Primero se ejecuta esto, luego lo de abajo. Si no harías esto, simplemente pasas lo de abajo dentro de reducers
export const logout = createAsyncThunk(
  "auth/logout",
  async (parametroDeLaFuncion, thunkAPI) => {
    console.log("Ejecutando logout")
    //Borrarme todos los datos del carrito de compras excepto los items, no tendríamos la necesidad de esto si es que siempre recargaríamos la paginas que navegamos porque abajo lo eliminamos del localStorage pero faltra eliminarlo en memoria
    thunkAPI.dispatch(CART_ACTIONS.resetFieldsByLogout());
    return ;
  }
);

const removeToken = () => {
    let cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
    localStorage.clear();
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLogged,
        userInfo: {
            name:"",
            email:"",
            isAdmin: false,
            shippingAddresses: []
        }
    },
    reducers: {
        loginSuccess(state, action){
            const token = action.payload;
            state.isLogged = true;
            localStorage.setItem("token", JSON.stringify(token));
        },
        registerSuccess(state, action){
            const token = action.payload;
            state.isLogged = true;
            localStorage.setItem("token", JSON.stringify(token));
        },
        getProfileSuccess(state, action){
            const userInfo = action.payload;
            state.userInfo = userInfo;
        },
        updateProfileSuccess(state, action){
            const userInfo = action.payload;
            state.userInfo = userInfo;
        },
        addShippingAddressSuccess(state, action){
            const shippingAddresses = action.payload;
            state.userInfo.shippingAddresses = shippingAddresses;
        },
        changeSelectedShippingAddressSuccess(state, action){
            const shippingAddresses = action.payload;
            state.userInfo.shippingAddresses = shippingAddresses;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(logout.fulfilled, (state, action) => {
            state.isLogged = false;     
            state.userInfo = {name: "", email: "", isAdmin: false, shippingAddresses: []};
            //Remover todo el localStorage excepto los items del carrito de compras
            removeToken()
        })
    }
})

export const {
    loginSuccess,
    registerSuccess,
    getProfileSuccess,
    updateProfileSuccess,
    addShippingAddressSuccess,
    changeSelectedShippingAddressSuccess,
} = authSlice.actions;

export default authSlice.reducer;