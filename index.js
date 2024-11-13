require("dotenv").config()
const express = require('express')
const morgan = require("morgan")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")


const connectDB = require('./config/bd')
const errorHandler = require('./middleware/errorHandling')
const notFound = require('./controller/notFound')
const userRoutes = require("./routes/userRoute")
const noteRoute = require("./routes/noteRoute")



//* server config
const app = express()


//* middleware
app.use(express.json({ limit: "500mb" }))
app.use(express.urlencoded({ limit: "500mb", extended: true }))
app.use(morgan("dev"))
app.use(cookieParser())

//* Routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/note", noteRoute)


//*Not found api request reoutes
app.use("*", notFound )


//*Erro handling
app.use(errorHandler)


//* Database 
connectDB()

//*Server connection
app.listen(process.env.PORT || 8001, () => {
    console.log("Serveris running on port", process.env.PORT)
})