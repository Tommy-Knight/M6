import mongoose from "mongoose";
import createError from "http-errors";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AuthorsSchema = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		password: {type: String, required: true},
		avatar: { type: String },
	},
	{ timestamps: true }
);

AuthorsSchema.pre("save", async function (next) {
	// BEFORE saving new user in db, hash the password
	const newUser = this;

	const plainPW = newUser.password;

	if (newUser.isModified("password")) {
		newUser.password = await bcrypt.hash(plainPW, 10);
	}

	next();
});

AuthorsSchema.methods.toJSON = function () {
	// toJSON is called every time express does a res.send

	const userDocument = this;

	const userObject = userDocument.toObject();

	delete userObject.password;

	delete userObject.__v;

	return userObject;
};

AuthorsSchema.statics.checkCredentials = async function (email, plainPW) {
	// 1. find user in db by email

	const user = await this.findOne({ email });

	if (user) {
		// 2. if user is found we need to compare plainPW with hashed PW
		const isMatch = await bcrypt.compare(plainPW, user.password);

		// 3. return a meaningful response

		if (isMatch) return user;
		else return null;
	} else {
		return null;
	}
};

AuthorsSchema.post("validate", (error, doc, next) => {
	if (error) {
		const err = createError(400, error);
		next(err);
	} else {
		next();
	}
});

AuthorsSchema.static("getAuthors", async function (id) {
	const blog = await this.findOne({ _id: id }).populate("comments");
	console.log(blog);
	return blog;
});

export default new model("AuthorModel", AuthorsSchema);
