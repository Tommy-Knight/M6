import AuthorModel from "../services/authors/schema.js";
import atob from "atob";
import createError from "http-errors";
import { verifyToken } from "./tools.js";

//<><><><>< CHECK FOR AUTH HEADERS, THEN SPLIT, DECODE AND COMPARE WITH DB CREDENTIALS, THEN ATTATCH TO REQ BODY <><><><><

export const basicAuthMiddleware = async (req, res, next) => {
	if (!req.headers.authorization) {
		next(createError(401, "👮‍♂️✋ BASIC AUTH NEEDED!🚔"));
	} else {
		const decoded = atob(req.headers.authorization.split(" ")[1]);
		const [email, password] = decoded.split(":");
		const author = await AuthorModel.checkCredentials(email, password);
		if (author) {
			req.author = author;
			next();
		} else {
			next(createError(401, "WRONG CREDENTIALS"));
		}
	}
};

//<><><><>< CHECK FOR AUTH HEADERS, FIND TOKEN, VERIFY TOKEN, SMILE AND WAVE <><><><><

export const JWTAuthMiddleware = async (req, res, next) => {
	console.log(req.headers);
	if (!req.headers.authorization) {
		next(createError(401, "Please provide credentials in the Authorization header!"));
	} else {
		try {
			const token = req.headers.authorization.replace("Bearer ", "");
			const decodedToken = await verifyToken(token);
			const author = await AuthorModel.findById(decodedToken._id);
			// console.log("🥩", decodedToken);
			if (author) {
				req.author = author;
				next();
			} else {
				next(createError(404, "Author not found!"));
			}
		} catch (error) {
			next(createError(401, "🔨BROKEN YOUR TOKEN!🔨"));
		}
	}
};
