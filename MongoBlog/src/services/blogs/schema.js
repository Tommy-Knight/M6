import mongoose from "mongoose"

const { Schema, model } = mongoose

const CommentSchema = new Schema({
	elementId: String,
	comment: String,
	author: String,
	rate: Number,
	date: "",
})

const BlogSchema = new Schema(
	{
		category: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		comments: {type:[CommentSchema], default:[]},
	},
	{ timestamps: true }
)

BlogSchema.static("findBlog", async function (id) {
	const blog = await this.findOne({ _id: id }).populate("comments")
	console.log(blog)
	return blog
})

BlogSchema.static("GetComments", async function (id) {
	const comments = await this.findById(id, { comments: 1 }).populate("comments")
	return comments
})

export default model("Blog", BlogSchema)