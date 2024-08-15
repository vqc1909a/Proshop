import axios from "axios";

// const urlBase = process.env.REACT_APP_BACK_URL;

const serverService = {
    getMock({params, url, headers}) {
        let header;
        let headerValues = {};

        if (typeof headers === "undefined" || headers === null) {
            header = new Headers();
        } else {
            header = new Headers(headers);
        }

        //Aqui puedo aumentar mas valores que acepta mi servidor a la respuesta;
        headerValues["Accept"] = ["application/json"];
        for (let val of headerValues["Accept"]) {
            header.append("Accept", val);
        }

        let requestOptions = {
            method: "GET",
            url,
            headers: Object.fromEntries(header),
            params
        };
        return axios(requestOptions);
    },

    putMock({params, url, headers, body}) {
        let header;
        let headerValues = {};

        if (typeof headers === "undefined" || headers === null) {
            header = new Headers();
        } else {
            header = new Headers(headers);
        }
        //Aqui puedo aumentar mas valores que acepta mi servidor a la respuesta;
        headerValues["Accept"] = ["application/json"];
        for (let val of headerValues["Accept"]) {
            header.append("Accept", val);
        }
        let requestOptions = {
            method: "PUT",
            url,
            headers: Object.fromEntries(header),
            params,
            data: body,
        };
        return axios(requestOptions);
    },

    postMock({params, url, headers, body}) {
        let header;
        let headerValues = {};
        if (typeof headers === "undefined" || headers === null) {
            header = new Headers();
        } else {
            header = new Headers(headers);
        }
        headerValues["Accept"] = ["application/json"];
        for (let val of headerValues["Accept"]) {
            header.append("Accept", val);
        }
        let requestOptions = {
            method: "POST",
            url,
            headers: Object.fromEntries(header),
            params,
            data: body,
        };
        return axios(requestOptions);
    },
    patchMock({params, url, headers, body}) {
        let header;
        let headerValues = {};
        if (typeof headers === "undefined" || headers === null) {
            header = new Headers();
        } else {
            header = new Headers(headers);
        }
        headerValues["Accept"] = ["application/json"];
        for (let val of headerValues["Accept"]) {
            header.append("Accept", val);
        }

        let requestOptions = {
            method: "PATCH",
            url,
            headers: Object.fromEntries(header),
            params,
            data: body,
        };
        return axios(requestOptions);
    },
};

export default serverService;