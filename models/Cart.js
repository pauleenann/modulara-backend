import mongoose, { model, Schema } from 'mongoose';

const CartSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            variant:{
                type: String,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Cart = model('Cart', CartSchema);
export default Cart;
