
import Ajv from "ajv";
import ajvSanitizer from "ajv-sanitizer";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { eliminarCamposVacios } from "../helpers/index.js";
import asyncHandler from "express-async-handler";
import validator from 'validator';

//Con esta propiedad de allError me saca en un array todos los errores, sino lo pongo simplemente me capturar en un array el primer error que encuentre
const ajv = new Ajv({allErrors: true});

//Eston para los mensajes personalizados
ajvErrors(ajv)

//Esto para sanear las entradas de nuestra esquema
ajvSanitizer(ajv);
addFormats(ajv);



const getShippingAddress = asyncHandler(async (req, res, next) => {
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
            //  properties: {
            //     address: "La dirección debe ser un texto, el valor actual es ${/address}",
            //     city: "La ciudad debe ser un texto, el valor actual es ${/city}",
            //     postalCode: "El código postal debe ser un número y su valor mínimo y máximo es de 10000 y 99999 respectivamente, el valor actual es ${/postalCode}",
            //     country: "El país debe ser un texto, el valor actual es ${/country}"
            // },
        }
    };
    
    const validate = ajv.compile(schema)
    const valid = ajv.validate(schema, body);

    console.log(body);
    console.log(valid);
    console.log(validate.errors);

//     [
// [0]   {
// [0]     instancePath: '',
// [0]     schemaPath: '#/errorMessage',
// [0]     keyword: 'errorMessage',
// [0]     params: { errors: [Array] },
// [0]     message: 'La dirección es obligatoria'
// [0]   },
// [0]   {
// [0]     instancePath: '',
// [0]     schemaPath: '#/errorMessage',
// [0]     keyword: 'errorMessage',
// [0]     params: { errors: [Array] },
// [0]     message: 'La ciudad es requerida'
// [0]   },
// [0]   {
// [0]     instancePath: '',
// [0]     schemaPath: '#/errorMessage',
// [0]     keyword: 'errorMessage',
// [0]     params: { errors: [Array] },
// [0]     message: 'El código postal es obligatorio'
// [0]   },
// [0]   {
// [0]     instancePath: '',
// [0]     schemaPath: '#/errorMessage',
// [0]     keyword: 'errorMessage',
// [0]     params: { errors: [Array] },
// [0]     message: 'El país es obligatorio'
// [0]   }
// [0] ]
    
    if(!valid){
        let message = validate.errors[0].message;
        res.status(400);
        throw new Error(message);
    }
    return next();
 
})


export {
    getShippingAddress
}   