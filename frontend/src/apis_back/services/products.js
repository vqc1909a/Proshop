import serverService from "../axiosConfig";

export const getProducts = async () => {
    let url = "/api/products";
    let headers = new Map([["Content-Type", "application/json"]]); 

    const {data, status, statusText} = await serverService.getMock({url, headers});
    return {data, status, statusText};
}

export const getProduct = async (slug) => {
    let url = `/api/products/${slug}`;
    let headers = new Map([["Content-Type", "application/json"]]); 

    const {data, status, statusText} = await serverService.getMock({url, headers});
    return {data, status, statusText};
} 