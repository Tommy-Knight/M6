import {
	badRequestErrorHandler,
	catchAllErrorHandler,
	notFoundErrorHandler,
} from "./errorHandlers.js";

import authorsRouter from "./services/authors/index.js";
import blogsRouter from "./services/blogs/index.js";
import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

console.time("Server startup");
const server = express();
const port = process.env.PORT || 3420;

// ><><><><: MIDDLEWARES :><><><>< \\

server.use(express.json());
server.use(cors());

// ><><><><: ROUTES :><><><>< \\

server.use("/blogs", blogsRouter);
server.use("/authors", authorsRouter);

console.table(listEndpoints(server));

// ><><><><: ERROR MIDDLEWARES :><><><>< \\

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

// ><><><><: MONGO TIME :><><><>< \\

mongoose.connect(process.env.MONGO_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to MongoDB 🌵")).then(
	server.listen(port, () => {
		console.log("Running on port", port, "🎇");
		console.timeEnd("Server startup");
	})
);
