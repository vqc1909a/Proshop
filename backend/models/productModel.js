import mongoose from "mongoose";
import slug from "slug";
import { nanoid } from 'nanoid'

const IVA = 0.18;


const ProductSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    slug: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    // Proyecto Real
    // categoryId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Category"
    // },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    priceIVA: {
        type: Number,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    // Para crear los campos de updatedAt and createdAt automaticamente sin crearlos en la parte de arriba
    timestamps: true,
    versionKey: false,
    minimize: false
})

ProductSchema.pre("save", function(next){
    this.slug = `${slug(this.name)}-${nanoid()}`;
    this.priceIVA = parseFloat((this.price * (1 + IVA)).toFixed(2)); 
    next();
})
ProductSchema.pre("insertMany", function(next, docs){
    docs.map(doc => {
        doc.slug = `${slug(doc.name)}-${nanoid()}`;
        doc.priceIVA = parseFloat((doc.price * (1 + IVA)).toFixed(2)); 
    })
    next();
})
ProductSchema.pre("findOneAndUpdate", function(next){
    if(this.get('price')){
        this.set({
            priceIVA: parseFloat((this.get('price') * (1 + IVA)).toFixed(2))
        })
    }
    next();
})
ProductSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    // delete returnedObject.createdAt
    // delete returnedObject.updatedAt
  }
})


const Product = mongoose.model("Product", ProductSchema);
export default Product;