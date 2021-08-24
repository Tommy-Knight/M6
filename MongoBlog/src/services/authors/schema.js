import mongoose from "mongoose";
import createError from "http-errors";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AuthorsSchema = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
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
	const userDocument = this;
	const userObject = userDocument.toObject();
	delete userObject.password;
	delete userObject.__v;
	return userObject;
};

AuthorsSchema.statics.checkCredentials = async function (email, plainPW) {
	const user = await this.findOne({ email });
	if (user) {
		const isMatch = await bcrypt.compare(plainPW, user.password);
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
//<><><><>< MONGOOSE  <><><><><

AuthorsSchema.static("getAuthors", async function (id) {
	const blog = await this.findOne({ _id: id }).populate("comments");
	console.log(blog);
	return blog;
});

export default new model("AuthorModel", AuthorsSchema);
