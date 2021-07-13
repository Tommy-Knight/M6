import mongoose from "mongoose";
import createError from "http-errors";

const { Schema, model } = mongoose;

const AuthorsSchema = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		avatar: { type: String },
	},
	{ timestamps: true }
);

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

export default new model("Author", AuthorsSchema);
