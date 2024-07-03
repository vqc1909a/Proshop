import serverService from "../axiosConfig";

export const searchShipping = async ({shippingAddress}) => {
    let url = "/api/shipping-address";
    let headers = new Map([["Content-Type", "application/json"]]); 

    const {data, status, statusText} = await serverService.postMock({url, headers, body: shippingAddress});
    return {data, status, statusText};
}

