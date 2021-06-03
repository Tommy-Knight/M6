import express from "express"
import createError from "http-errors"
import BlogModel from "./schema.js"

const blogsRouter = express.Router()

blogsRouter.get("/", async (req, res, next) => {
	try {
		const blogs = await BlogModel.find({})
		res.send(blogs)
	} catch (error) {
		console.log(error)
		next(createError(500, "An error occurred while getting blogs"))
	}
})

blogsRouter.get("/:id", async (req, res, next) => {
	try {
		const blog = await blogModel.findBlog(req.params.id)

		blog
			? res.send(blog)
			: next(createError(404, `Blog ${req.params.id} not found`))
	} catch (error) {
		next(error)
	}
})
//  <><><><> PREVIOUS CODE BEFORE USING FINDBLOG FROM SCHEMA <><><><>
// 	try {
// 		const id = req.params.id
// 		const blog = await BlogModel.findById(id)
// 		if (blog) {
// 			res.send(blog)
// 		} else {
// 			next(createError(404, `Blog ${req.params.id} not found`))
// 		}
// 	} catch (error) {
// 		console.log(error)
// 		next(createError(500, "An error occurred while getting blog"))
// 	}
// })

blogsRouter.post("/", async (req, res, next) => {
	try {
		const newblog = new BlogModel(req.body)
		const { _id } = await newblog.save()

		res.status(201).send(_id)
	} catch (error) {
		console.log(error)
		if (error.name === "ValidationError") {
			next(createError(400, error))
		} else {
			next(createError(500, "An error occurred while saving blog"))
		}
	}
})

blogsRouter.put("/:id", async (req, res, next) => {
	try {
		const blog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true,
		})
		if (blog) {
			res.send(blog)
		} else {
			next(createError(404, `Blog ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error occurred while modifying blog"))
	}
})

blogsRouter.delete("/:id", async (req, res, next) => {
	try {
		const blog = await BlogModel.findByIdAndDelete(req.params.id)
		if (blog) {
			res.status(204).send()
		} else {
			next(createError(404, `Student ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error occurred while deleting student"))
	}
})

blogsRouter.get("/:id/comments/", async (req, res, next) => {
	try {
		const blogPost = await BlogModel.findById(req.params.id, {
			comments: 1,
			_id: 0,
		})
		if (blogPost) {
			res.send(blogPost.comments)
		} else {
			next(createError(404, `Blog with id: ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error while getting comments"))
	}
})

blogsRouter.get("/:id/comments/:commentId", async (req, res, next) => {
	try {
		const blogPost = await BlogModel.findOne(
			{
				_id: req.params.id,
			},
			{
				comments: {
					$elemMatch: { _id: req.params.commentId },
				},
			}
		)
		if (blogPost) {
			const { comments } = blogPost
			if (comments && comments.length > 0) {
				res.send(comments[0])
			} else {
				next(
					createError(
						404,
						`Comment with id: ${req.params.commentId} not found in this blog`
					)
				)
			}
		} else {
			next(createError(404, `Blog with id: ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error while looking for comments"))
	}
})

blogsRouter.post("/:id/comments/", async (req, res, next) => {
	try {
		const comment = req.body
		const commentToInsert = { ...comment, date: new Date() }
		const updatePost = await BlogModel.findByIdAndUpdate(
			req.params.id,
			{
				$push: {
					comments: commentToInsert,
				},
			},
			{ runValidators: true, new: true }
		)
		if (updatePost) {
			res.send(updatePost)
		} else {
			next(createError(404, `Post with id ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error while posting update"))
	}
})

blogsRouter.put("/:id/comments/:commentId", async (req, res, next) => {
	try {
		const blogPost = await BlogModel.findOneAndUpdate(
			{
				_id: req.params.id,
				"comments._id": req.params.commentId,
			},
			{ $set: { "comments.$": req.body } },
			{
				runValidators: true,
				new: true,
			}
		)
		if (blogPost) {
			res.send(blogPost)
		} else {
			next(createError(404, `Blog with id:${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error while updating comments"))
	}
})
blogsRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
	try {
		const blogPost = await BlogModel.findByIdAndUpdate(
			req.params.id,
			{
				$pull: {
					comments: { _id: req.params.commentId },
				},
			},
			{
				new: true,
			}
		)
		if (blogPost) {
			res.send(blogPost)
		} else {
			next(createError(404, `Blog with id: ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error while deleting comment"))
	}
})

export default blogsRouter
