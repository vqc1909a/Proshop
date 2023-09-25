import serverService from "../axios";

export const saveOrder = async ({order, token}) => {
    let url = "/api/orders";
    let headers = new Map([
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${token}`]
    ]); 

    const {data, status, statusText} = await serverService.postMock({url, headers, body: order});
    return {data, status, statusText};
}
