import mongoose, { model, Schema } from 'mongoose';

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ['3-Seater Sofa', 'Sectional Sofa', 'Loveseat', 'Single Seater'],
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    ratings:{
        type: Number,
        default: 0
    },
    totalQuantity:{
        type: Number,
        required: true
    },
    totalSold:{
        type: Number,
        default: 0
    },
    attributes:{
        variants: [
            {
                color: String,
                name: String,
                quantity: Number
            }
        ],
        features: [String],
        measurements:{
            overallWidth: String,
            depth: String,
            height: String,
            seatHeight: String,
            seatDepth: String,
            armHeight: String,
            legHeight: String
        }
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Product = model('Product', ProductSchema)
export default Product