
import Ajv from "ajv";
import ajvSanitizer from "ajv-sanitizer";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { eliminarCamposVacios } from "../helpers/index.js";
import asyncHandler from "express-async-handler";
import validator from 'validator';

// Los siguientes formatos se definen en formatos ajv

const ajv = new Ajv({allErrors: true});
ajvErrors(ajv)
ajvSanitizer(ajv);
addFormats(ajv);

//EStos son todas las valdiaciones que tenemos
// The package defines these formats:

// date: full-date according to RFC3339.
// time: time (time-zone is mandatory).
// date-time: date-time (time-zone is mandatory).
// iso-time: time with optional time-zone.
// iso-date-time: date-time with optional time-zone.
// duration: duration from RFC3339
// uri: full URI.
// uri-reference: URI reference, including full and relative URIs.
// uri-template: URI template according to RFC6570
// url (deprecated): URL record.
// email: email address.
// hostname: host name according to RFC1034.
// ipv4: IP address v4.
// ipv6: IP address v6.
// regex: tests whether a string is a valid regular expression by passing it to RegExp constructor.
// uuid: Universally Unique IDentifier according to RFC4122.
// json-pointer: JSON-pointer according to RFC6901.
// relative-json-pointer: relative JSON-pointer according to this draft.
// byte: base64 encoded data according to the openApi 3.0.0 specification
// int32: signed 32 bits integer according to the openApi 3.0.0 specification
// int64: signed 64 bits according to the openApi 3.0.0 specification
// float: float according to the openApi 3.0.0 specification
// double: double according to the openApi 3.0.0 specification
// password: password string according to the openApi 3.0.0 specification
// binary: binary string according to the openApi 3.0.0 specification

const login = asyncHandler(async (req, res, next) => {
    let body = eliminarCamposVacios(req.body);  

    //----------Podemos crear nuestras propias validaciones personalizadas simplemente dandole un nombre y asignando la validación--------------------
    // const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // ajv.addFormat('email-format', {
    //     validate: (format) => emailRegex.test(format)
    // });
    
    // ajv.addFormat("byte",
    //     type: "number",
    //     validate: (x) => x >= 0 && x <= 255 && x % 1 == 0,
    // })
    // ajv.addFormat("identifier", /^a-z\$_[a-zA-Z$_0-9]*$/)
    //----------------------------------------------------------------

    const schema = {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                sanitize: value => validator.normalizeEmail(value, { gmail_remove_dots: false }),
                // format: 'email-format',
                format: 'email',
                errorMessage: {
                    type: "El email debe ser un texto",
                    format: "El email es inválido"
                }
            },
            password: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "El password debe ser un texto",
                }
            }
        },
        required: ["email", "password"],
        additionalProperties: false,
        errorMessage: {
            type: 'should be an object',
            required: {
                email: "El email es obligatorio",
                password: "El password es obligatorio",
            },
        }
    };

    const validate = ajv.compile(schema)
    const valid = ajv.validate(schema, body);

    console.log({
        body,
        valid,
        validate: validate.errors //Este es el array de errores
    })
    
    if(!valid){
        let message = validate.errors[0].message;
        res.status(400);
        throw new Error(message);
    }
    return next();
})

const register = asyncHandler(async (req, res, next) => {
    let body = eliminarCamposVacios(req.body);  

    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "El nombre debe ser un texto"
                }
            },
            email: {
                type: 'string',
                sanitize: value => validator.normalizeEmail(value, { gmail_remove_dots: false }),
                format: 'email',
                errorMessage: {
                    type: "El email debe ser un texto",
                    format: "El email es inválido"
                }
            },
            password: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "El password debe ser un texto",
                }
            },
            confirm_password: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "La confirmación del password debe ser un texto",
                }
            }
        },
        required: ["name", "email", "password", "confirm_password"],
        // Significa que cualquier propiedad adicional que pasemos en el body y que no esté definida en el esquema será rechazada y la validación fallará si o si dicciendo que no puedes pasar propiedades adicionales
        additionalProperties: false,
        errorMessage: {
            type: 'should be an object',
            required: {
                name: "El nombre es obligatorio",
                email: "El email es obligatorio",
                password: "El password es obligatorio",
                confirm_password: "La confirmación de password es obligatorio"
            },
        }
    };

    const validate = ajv.compile(schema)
    const valid = ajv.validate(schema, body);

    console.log({
        body,
        valid,
        validate: validate.errors //Este es el array de errores
    })
    
    if(!valid){
        let message = validate.errors[0].message;
        res.status(400);
        throw new Error(message);
    }
    return next();
})

export {
    login,
    register
}   