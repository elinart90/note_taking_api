const mongoose = require("mongoose")

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        default: "pending"
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true})


const Note = mongoose.model("Note", noteSchema)

module.exports = Note  