import mongoose from "mongoose"
import AuthorsSchema from "../authors/schema.js"

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
		comments: { type: [CommentSchema], default: [] 
		},
		author: { type: Schema.Types.ObjectId, ref: "Author" ,default: {}
	},
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


BlogSchema.pre("save", async function (done) {
	try {
		const isExist = await AuthorsSchema.findById(this.author)
		if (isExist) {
			done()
		} else {
			const error = new Error("this author does not exist")
			error.status = 400
			done(error)
		}
	} catch (error) {
		done(error)
	}
})