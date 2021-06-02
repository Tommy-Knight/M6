import mongoose from 'mongoose';

const { Schema, model } = mongoose;

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
		comments: [
			{
				elementId: String,
				comment: String,
				author: String,
				rate: Number,
				date: "",
			},
		],
	},
	{ timestamps: true }
)

export default model('Blog', BlogSchema)

