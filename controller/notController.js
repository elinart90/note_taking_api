const Note = require("../models/noteModel")
const User = require("../models/userModel")



const addNote = async(req, res, next) => {
    try {
        const { title, description,assignedTo } = req.body
        const { _id } = req.user 

        //* check if the user exist
        const user = await User.findById(_id)
        if(!user) {
            return res.status(400).json({
                message: "User not found "
            })
        }

        const newNote = new Note({ 
            title, 
            description, 
            assignedTo, 
            updatedBy:_id
        })
        await newNote.save()

        res.status(200).json({
            code: 200,
            status: true,
            message: "Note add successfully"
        })
        
    } catch (error) {
        next(error)
    }
}


const getNoteById = async(req, res, next) =>{
    try {
        const { id } = req.params

        //* Find the note
        const note = await Note.findById(id)
        if(!note) {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        //* Automatically change status to "in progress" if it's currently "pendiung"
        if(note.status == "pending") {
            note.status = "in progress";
            await note.save()
        }

        res.status(200).json({
            code: 200,
            status: true,
            data: note
        })
        
    } catch (error) {
        next(error)
    }
}


const updateStatus = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "in progress", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const note = await Note.findByIdAndUpdate(
            id,
            { status },
            { new:  true}
        )

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }
        

        //* Update status and save
        note.status = status;
        await note.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Status updated successfully",
            data: note
        });

    } catch (error) {
        next(error);
    }
};



const getAllNote = async(req, res, next) => {
    try {
        
        const { q, size, page } = req.body
        let query = {}

        const sizeNumber = parseInt(size) || 10
        const pageNumber = parseInt(page) || 1

        if(q) {
            const search = RegExp(q, "i")
            query = { $or: [{ title: search }, { description: search}]}
        }

        const total = await Note.countDocuments(query)
        const pages = Math.ceil(total / sizeNumber)

        //*Page Number
        const notes = await Note.find(query)
        .skip((pageNumber -1) * sizeNumber)
        .limit(sizeNumber)
        .sort({ updatedBy: -1})

        res.status(200).json({
            code: 200,
            status: true,
            message: "Get all note successfully",
            data: { notes, pages, total }
        })
        
    } catch (error) {
        next(error)
    } 
}


const updetedNote = async(req, res, next) => {
    try {
        const {id} = req.params
        const { _id } = req.user
        const { title, description } = req.body

        const note = await Note.findById(id)
        if(!note) {
            return res.status(404).json({
                message: "Note not found"
            })
        }

        const isNoteExist = await Note.findOne({ title })
        if(isNoteExist && String(isNoteExist._id) === String(id) && isNoteExist.title === title) {
            return res.status(400).json({
                message: "No changes made to the title"
            })
        }

        note.title = title ? title : note.title
        note.description = description ? description : note.description
        note.updatedBy = _id
        await note.save()
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Note updated successfully",
            data: { note }
        })
        
    } catch (error) {
        next(error)
    }
}


const deleteNote = async(req, res, next) => {
    try {
        const {id} = req.params

        const note = await Note.findById(id)
        if(!note) {
            return res.status(404).json({
                message: "Note note found"
            })
        }

        await Note.findByIdAndDelete(id)

        res.status(200).json({
            code: 200,
            status: true,
            message: "Note deleted successfully",
        })


        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addNote,
    getNoteById,
    updateStatus,
    getAllNote,
    updetedNote,
    deleteNote
}