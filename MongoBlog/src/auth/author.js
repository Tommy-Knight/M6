import createError from "http-errors";
import atob from "atob";
import AuthorModel from "../services/authors/schema.js";

//<><><><>< CHECK FOR AUTH HEADERS, THEN SPLIT, DECODE AND COMPARE WITH DB CREDENTIALS, THEN ATTATCH TO REQ BODY <><><><><

export const basicAuthMiddleware = async (req, res, next) => {
	if (!req.headers.authorization) {
		next(createError(401, "Please provide Authentication!"));
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
