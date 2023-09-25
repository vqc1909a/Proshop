export default (err, req, res, next) => {
    //Cuando es un error del servidor me bota que el statusCode de res es 200, nosexq la verdad debería ser 500 pero me bota 200, supongo que es por defecto cuando haces un request, igual con algún fallo de una librería de terceros, me bota el statusCode de 200 o sea correcto, es por eso que abajo hacemos la correción, y normalmente el err.status es undefined, por eso siempre le poníamos que nos votara 500 con algun fallo interno o externo de una librería. LA VERDAD DEL || ERA PORQUE EL STATUSCODE Y EL STATUS DEL ERR ERA PORQUE EN UN PRINCIPIO EL STATUSCODE ES DE 200 CUANDO HACES UN PETICIÓN A CUALQUIER REQUEST

    const status = err.status ? err.status : res.statusCode === 200 ? 500 : res.statusCode
    const message = err.message;

    return res.status(status).json({
        status,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}