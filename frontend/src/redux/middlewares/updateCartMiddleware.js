
//A middleware is a function that receives the store's dispatch and getState functions as arguments and returns a function. This function will receive the next middleware's dispatch function and return a function that will receive the action to be dispatched.
export const updateCartMiddleware = (state) => {
	return (next) => (action) => {
		
		next(action);
		// console.log({
		// 	state: state.getState(),
		// 	action,
		// });
		const actions = [
			"cart/addItem",
			"cart/removeItem",
			"cart/updateItem",
		]
		if(actions.includes(action.type)){
			const {cart} = state.getState();
			localStorage.setItem("cartItems", JSON.stringify(cart.items));
		}
	};
};
