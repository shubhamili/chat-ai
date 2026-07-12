import mongoose, { Schema } from "mongoose";


const conversationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
}, { timestamps: true })

const messageSchema = new Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model"],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

export { Conversation, Message };