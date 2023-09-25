
import Ajv from "ajv";
import ajvSanitizer from "ajv-sanitizer";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { eliminarCamposVacios } from "../helpers/index.js";
import asyncHandler from "express-async-handler";
import validator from 'validator';

const ajv = new Ajv({allErrors: true});
ajvErrors(ajv)
ajvSanitizer(ajv);
addFormats(ajv);

const updateProfile = asyncHandler(async (req, res, next) => {
    let body = eliminarCamposVacios(req.body);  

    const schema = {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "El nombre debe ser un texto",
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
           
        },
        required: ["name", "email"],
        additionalProperties: true,
        errorMessage: {
            type: 'should be an object',
            required: {
                name: "El nombre es obligatorio",
                email: "El email es obligatorio"
            }
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

const updatePassword = asyncHandler(async (req, res, next) => {
    let body = eliminarCamposVacios(req.body);  

    const schema = {
        type: 'object',
        properties: {
            current_password: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "El password debe ser un texto",
                }
            },
            new_password: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "El nuevo password debe ser un texto",
                }
            },
            confirm_new_password: {
                type: 'string',
                sanitize: 'text',
                errorMessage: {
                    type: "La confirmación del nuevo password debe ser un texto",
                }
            }
        },
        required: ["current_password", "new_password", "confirm_new_password"],
        additionalProperties: false,
        errorMessage: {
            type: 'should be an object',
            required: {
                current_password: "El password actual es obligatorio",
                new_password: "El nuevo password es obligatorio",
                confirm_new_password: "La confirmacion del nuevo password es obligatorio"
            }
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

const addShippingAddress = asyncHandler(async (req, res, next) => {
    let body = eliminarCamposVacios(req.body);  

    ajv.addFormat("postalCode-format", /^\d{5}$/);

    const schema = {
        type: 'object',
        properties: {
            address: {
                type: "string",
                sanitize: 'text',
                errorMessage: {
                    type: "La dirección debe ser un texto"
                }
            },
            city: {
                type: "string",
                sanitize: 'text',
                errorMessage: {
                    type: "La ciudad debe ser un texto"
                }
                // enum: ["pasco", "arequipa"]
            },
            postalCode: {
                type: "string",
                sanitize: 'text',
                format: 'postalCode-format',
                errorMessage: {
                    type: "El codigo postal debe ser un numero", //Solo funcionara el format, igaul para solo numeros puede crear tu expresión regular
                    format: "El codigo postal es un número de 5 dígitos"
                }
            },
            country: {
                type: "string",
                sanitize: 'text',
                errorMessage: {
                    type: "El país debe ser un texto"
                }
            },
        },
        required: ["address", "city", "postalCode", "country"],
        additionalProperties: false,
        errorMessage: {
            type: 'should be an object',
            required: {
                address: "La dirección es obligatoria",
                city: "La ciudad es requerida",
                postalCode: "El código postal es obligatorio",
                country: "El país es obligatorio"
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
    updateProfile,
    updatePassword,
    addShippingAddress
}   