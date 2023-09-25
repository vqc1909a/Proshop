export const selectIsLogged = (state) => {
    return state.auth.isLogged
}
export const selectRedirectTo = (state) => {
    return state.auth.redirectTo
}
export const selectUserInfo = (state) => {
    return state.auth.userInfo
}
export const selectShippingAdresses = (state) => {
    return state.auth.userInfo.shippingAddresses
}
export const selectIsAdmin = (state) => {
    return state.auth.userInfo.isAdmin
}
export const selectIsSuperAdmin = (state) => {
    return state.auth.userInfo.isSuperAdmin
}





