import {createSlice} from "@reduxjs/toolkit";

const items = JSON.parse(localStorage.getItem("cartItems") ?? '[]');
const paymentMethod = JSON.parse(localStorage.getItem("paymentMethod") ?? '""');
const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") ?? '{}');

const qtyItems = items.reduce((acc, item) => acc + item.qty, 0);
const itemsPrice = parseFloat(items.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2));
const totalPrice = parseFloat(items.reduce((acc, item) => acc + (item.priceIVA * item.qty), 0).toFixed(2));
const taxPrice = parseFloat((totalPrice - itemsPrice).toFixed(2));

const updateCart = (state) => {
    state.qtyItems = state.items.reduce((acc, item) => acc + item.qty, 0);
    state.itemsPrice = parseFloat(state.items.reduce((acc, item) => acc + (item.price *  item.qty), 0).toFixed(2));
    state.totalPrice = parseFloat(state.items.reduce((acc, item) => acc + (item.priceIVA * item.qty), 0).toFixed(2));
    state.taxPrice = parseFloat((state.totalPrice - state.itemsPrice).toFixed(2));
    //AQui hacemos el cacluclo otra xq solo estamos aumentanto el precio total xq si lo hacemos de forma unica el taxPrice va a dar un valor erroneo
    state.totalPrice = state.totalPrice + (state.shippingAddress?.regionId?.shippingPrice || 0);
}
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items,  
        qtyItems,
        itemsPrice,
        taxPrice,
        totalPrice: totalPrice + (shippingAddress?.regionId?.shippingPrice || 0),
        shippingAddress,
        paymentMethod
    },
    reducers: {
        addItem(state, action){
            const product = action.payload;
            //!Aqui me busca en los items que tengo agregado
            const item = state.items.find(item => item.id === product.id);
            if(item){
                const qtyTotal = item.qty + product.qty;
                if(product.countInStock < qtyTotal){
                    item.qty = product.countInStock;
                }else{
                    item.qty += product.qty;;
                }
            }else{
                state.items.push(product);
            }
            updateCart(state);
        },
        removeItem(state, action){
            const id = action.payload;
            const newItems = state.items.filter(item => item.id !== id);
            state.items = newItems;
            updateCart(state);
        },
        updateItem(state, action){
            const {id, qty} = action.payload;
            const item = state.items.find(item => item.id === id);
            item.qty = qty
            updateCart(state);
        },
        saveShippingAddress(state, action){
            const shippingAddress = action.payload;
            //Aqui evalua el shippingAddress del carrito y esto siempre va a llamar siempre que haya una dirección seleccionada, o sea que si o si existe el shippingAddress
            if(!state.shippingAddress){
                state.totalPrice = state.totalPrice + (state.shippingAddress?.regionId?.shippingPrice || 0);
            }else{
                if(state.shippingAddress.id !== shippingAddress.id){
                    state.totalPrice = state.totalPrice - (state.shippingAddress?.regionId?.shippingPrice || 0) + (shippingAddress?.regionId?.shippingPrice || 0)
                }
            }
            state.shippingAddress = shippingAddress;
            localStorage.setItem("shippingAddress", JSON.stringify(state.shippingAddress));
        },
        //Un verdadero Ecommerce debería o no tener tarjetas guardadas pero no todo se guarda como en linio, si la opción es pagar con credit card or debit card deben estar guardadas en su panel de administración, pero en este caso sera una tarjeta en memoria que no viene del backend sino al instante de hacer el pago
        savePaymentMethod(state, action){
            const paymentMethod = action.payload;
            state.paymentMethod = paymentMethod;
            localStorage.setItem("paymentMethod", JSON.stringify(state.paymentMethod));
        },
        //Se queda toda la info del carrito de compras nada más
        resetFieldsByLogout(state, action){
            state.shippingAddress = {};
            state.paymentMethod = "Paypal";
            localStorage.removeItem("paymentMethod");
            localStorage.removeItem("shippingAddress");
        },
        clearCart(state, action){
            state.items = [];
            state.qtyItems = 0;
            state.itemsPrice = 0;
            state.taxPrice = 0;
            state.totalPrice = 0;
            state.shippingAddress = {};
            state.paymentMethod = "Paypal";
            localStorage.removeItem("cartItems");
            localStorage.removeItem("paymentMethod");
            localStorage.removeItem("shippingAddress");
        }
    }
})

export const {addItem, removeItem, updateItem, saveShippingAddress, savePaymentMethod, resetFieldsByLogout, clearCart} = cartSlice.actions;

export default cartSlice.reducer;