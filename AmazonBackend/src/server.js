import express from "express"
import cors from "cors"
import db from "./db/index.js"
import services from "./services/index.js"
import listEndpoints from "express-list-endpoints"

const server = express()
const port = process.env.PORT || 3069

server.use(cors())
server.use(express.json())

server.use("/", services)

db.sequelize
	.sync({ force: false })
	.then(() => {
		server.listen(port, () => {
			console.table(listEndpoints(server))
			console.log(`Server is HAPPY on port: ${port} 👍`)
		})
		server.on("error", (error) =>
			console.info(`Server is SAD with: ${error} 👎`)
		)
	})
	.catch((error) => console.log(error))
