import mongoose, { model, Schema } from "mongoose"

const RefreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt:{
        type: Date,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    deviceInfo:{
        browser: String,
        version: String,
        os: String,
        platform: String,
        source: String,
    }
})

const RefreshToken = model('RefreshToken', RefreshTokenSchema)
export default RefreshToken