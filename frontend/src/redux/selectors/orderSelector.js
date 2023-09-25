export const selectMessage = (state) => {
    return state.order.message
}
export const selectIsError = (state) => {
    return state.order.isError
}
export const selectIsLoading = (state) => {
    return state.order.isLoading
}
export const selectOrder = (state) => {
    return state.order.order
}
