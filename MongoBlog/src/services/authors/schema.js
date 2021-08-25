import bcrypt from "bcrypt";
import createError from "http-errors";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuthorsSchema = new Schema(
	{
		name: { type: String, required: true, default: "User" },
		surname: { type: String, required: true, default: "Surname" },
		email: { type: String, required: true },
		password: { type: String, required: true },
		roles: { type: String, required: true, enum: ["Admin", "User"], default: "User" },
		avatar: { type: String },
	},
	{ timestamps: true }
);

//<><><><>< HASH THE PASSWORDS <><><><><

AuthorsSchema.pre("save", async function (next) {
	const newUser = this;
	const plainPW = newUser.password;
	if (newUser.isModified("password")) {
		newUser.password = await bcrypt.hash(plainPW, 10);
	}
	next();
});

//<><><><>< HANDLES THE JSON RETURN <><><><><

AuthorsSchema.methods.toJSON = function () {
	const authorDocument = this;
	const authorObject = authorDocument.toObject();
	delete authorObject.password;
	delete authorObject.__v;
	return authorObject;
};

//<><><><>< COMPARE PASSWORDS <><><><><

AuthorsSchema.statics.checkCredentials = async function (email, plainPW) {
	const author = await this.findOne({ email });
	if (author) {
		const isMatch = await bcrypt.compare(plainPW, author.password);
		return isMatch ? author : null;
		// if (isMatch) return author;
		// else return null;
	} else {
		return null;
	}
};

//<><><><>< MONGOOSE GETAUTHORS <><><><><

AuthorsSchema.static("getAuthors", async function (id) {
	const blog = await this.findOne({ _id: id }).populate("comments");
	console.log(blog);
	return blog;
});

export default new model("AuthorModel", AuthorsSchema);
