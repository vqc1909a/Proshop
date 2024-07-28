import mongoose from "mongoose";

const GeographicRegionSchema = mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    }
}, {
    // Para crear los campos de updatedAt and createdAt automaticamente sin crearlos en la parte de arriba
    timestamps: true,
    versionKey: false,
    minimize: false
})

GeographicRegionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.createdAt
    delete returnedObject.updatedAt
  }
})

const GEographicRegion = mongoose.model("GeographicRegion", GeographicRegionSchema);
export default GEographicRegion;