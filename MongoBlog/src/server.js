import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import blogsRouter from "./services/blogs/index.js"
import authorsRouter from "./services/authors/index.js"
import {
	notFoundErrorHandler,
	badRequestErrorHandler,
	catchAllErrorHandler,
} from "./errorHandlers.js"


const server = express()
const port = process.env.PORT || 3420

// ><><><><: MIDDLEWARES :><><><>< \\

server.use(express.json())
server.use(cors())

// ><><><><: ROUTES :><><><>< \\


server.use("/blogs", blogsRouter)
server.use("/authors", authorsRouter)

// ><><><><: ERROR MIDDLEWARES :><><><>< \\

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

// ><><><><: MONGO TIME :><><><>< \\

mongoose.connect(process.env.MONGO_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})

const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Connected to MongoDB 🌵"))

.then(
		server.listen(port, () => {
			console.log("Running on port", port, "🎇")
		})
	)
