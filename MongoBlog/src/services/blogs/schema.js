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

export default model("Blog", BlogSchema)
