import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BlogSchema = new Schema({
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
},
{timestamps: true}
)

export default model('Blogs', BlogSchema)