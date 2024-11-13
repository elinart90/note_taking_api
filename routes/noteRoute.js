const express = require("express")
const router = express.Router()


const noteController = require("../controller/notController")
const { addNoteValidator, idVlidator, updateStatusValidator} = require('../validator/noteValidator')
const validate = require("../validator/validator")
const isAdmin = require('../middleware/isAdmin')
const isAuth = require("../middleware/isAuth")




router.post("/", isAuth, isAdmin, addNoteValidator, validate, noteController.addNote )

router.get("/",isAuth, noteController.getAllNote)

router.get("/:id", isAuth, noteController.getNoteById)

router.put("/:id/status", isAuth, updateStatusValidator, noteController.updateStatus)

router.put("/:id", isAuth, isAdmin, idVlidator, validate, noteController.updetedNote)

router.delete("/:id", isAuth, isAdmin, noteController.deleteNote)

module.exports = router  