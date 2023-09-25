import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
    minimize: false
})

ReviewSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    // delete returnedObject.createdAt
    // delete returnedObject.updatedAt
  }
})
const Review = mongoose.model("Review", ReviewSchema);
export default Review;