export default (req, res) => {
    return res.status(404).json({status: 404, message: `Resource Not Found - ${req.originalUrl}`})
}
