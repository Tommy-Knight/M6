import createError from "http-errors";

export const adminOnly = (req, res, next) => {
	if (req.author.role === "Admin") next();
	else next(createError(418, "Admins only! No teapots. ☕"));
};

export const checkEditPrivileges = (req, res, next) => {
	if (req.author.role === "Admin" || req.author._id === req.params.id) next();
	else next(createError(403, "Unauthorized"));
};
