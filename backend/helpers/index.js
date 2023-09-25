export const eliminarCamposVacios = (body) => {
    for (const key in body) {
        if (body.hasOwnProperty(key)) {
            const value = body[key];
            if(!value){
                delete body[key];
            }
        }
    }
    return body
}
