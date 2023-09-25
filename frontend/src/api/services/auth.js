import serverService from "../axios";

export const loginUser = async (user) => {
    let url = "/api/auth/login";
    let headers = new Map([["Content-Type", "application/json"]]); 

    const {data, status, statusText} = await serverService.postMock({url, headers, body: user});
    return {data, status, statusText};
}

export const registerUser = async ({user}) => {
    let url = `/api/auth/register`;
    let headers = new Map([["Content-Type", "application/json"]]); 

    const {data, status, statusText} = await serverService.postMock({url, headers, body: user});
    return {data, status, statusText};
} 