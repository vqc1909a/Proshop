import serverService from "../axiosConfig";

export const getLoggedUser = async (token) => {
    let url = "/api/profile";
    let headers = new Map([
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${token}`]
    ]);    
    const {data, status, statusText} = await serverService.getMock({url, headers});
    return {data, status, statusText};
}

export const updateLoggedUser = async (token, user) => {
    let url = "/api/profile";
    let headers = new Map([
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${token}`]
    ]);    
    const {data, status, statusText} = await serverService.putMock({url, headers, body: user});
    return {data, status, statusText};
}

export const updatePassword = async (token, passwords) => {
    let url = "/api/profile/change-password";
    let headers = new Map([
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${token}`]
    ]);    
    const {data, status, statusText} = await serverService.patchMock({url, headers, body: passwords});
    return {data, status, statusText};
}

export const addShippingAddress = async (token, shippingAddress) => {
    let url = "/api/profile/add-shipping-address";
    let headers = new Map([
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${token}`]
    ]);    
    const {data, status, statusText} = await serverService.postMock({url, headers, body: shippingAddress});
    return {data, status, statusText};
}

export const changeSelectedShippingAddress = async (token, idSelectedShippingAddress) => {
    let url = "/api/profile/change-selected-shipping-address";
    let headers = new Map([
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${token}`]
    ]);    
    const {data, status, statusText} = await serverService.postMock({url, headers, body: {idSelectedShippingAddress}});
    return {data, status, statusText};
}


