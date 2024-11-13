const { check, param } = require('express-validator')
const mongoose = require("mongoose")


const addNoteValidator = [
    check("title")
    .notEmpty().withMessage("Tile is required"),

    check("description")
    .notEmpty().withMessage("Please give a short description"),

    check("assignedTo")
    .notEmpty().withMessage("Please assign a user")
]


const idVlidator = [
    param("id").custom(async(id) => {
        if(id && !mongoose.Types.ObjectId.isValid(id)){
            throw "Invalid category id"
        }
    }),

]


const updateStatusValidator = [
    check("status")
        .isIn(["pending", "in progress", "completed"])  // Checks if status is one of these values
        .withMessage("Status must be either 'pending', 'in progress', or 'completed'")
];


module.exports = {
    addNoteValidator,
    idVlidator,
    updateStatusValidator
}