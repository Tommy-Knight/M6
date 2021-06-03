import express from "express"
import createError from "http-errors"
import multer from "multer"
import getAuthors from "./schema.js"

const authorsRouter = express.Router()

authorsRouter.get("/", async (req, res, next) => {
	try {
		const authors = await getAuthors.find({})
		res.send(authors)
	} catch (error) {
		console.log(error)
		next(createError(500, "An error occurred while getting authors"))
	}
})

authorsRouter.get("/:id", async (req, res) => {
	const authors = await getAuthors()

	const author = authors.find((author) => author._id === req.params.id)

	author
		? res.send(author)
		: res.send("Author does not exist, check your author ID")
})

authorsRouter.post("/", async (req, res, next) => {
	try {
		const newauthor = new getAuthors(req.body)
		const { _id } = await newauthor.save()
		console.log(newauthor)
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

authorsRouter.put("/:id", async (req, res) => {
	const authors = await getAuthors()
	const newAuthorsArray = authors.filter(
		(author) => author._id !== req.params.id
	)
	const author = authors.find((author) => author._id === req.params.id)

	if (!author) {
		next(createError(400, "id does not match"))
	}

	const updatedAuthor = {
		...req.body,
		createdOn: author.createdOn,
		_id: author._id,
		lastUpdatedOn: new Date(),
	}
	newAuthorsArray.push(updatedAuthor)

	await writeAuthors(newAuthorsArray)

	res.send(updatedAuthor)
})

authorsRouter.delete("/:id", async (req, res, next) => {
	try {
		const authors = await getAuthors.findByIdAndDelete(req.params.id)
		if (authors) {
			res.status(204).send()
		} else {
			next(createError(404, `Author ${req.params.id} not found`))
		}
	} catch (error) {
		console.log(error)
		next(createError(500, "An error occurred while deleting author"))
	}
})

authorsRouter.post(
	"/:id/uploadAvatar",
	multer().single("authorAvatar"),
	async (req, res, next) => {
		try {
			console.log(req.file)
			const authors = await getAuthors()

			let author = authors.find((author) => author._id === req.params.id)
			if (!author) {
				next(createError(400, "id does not match"))
			}

			await writeAuthorAvatars(req.params.id + ".jpg", req.file.buffer)

			author.avatar = `http://localhost:3001/images/authorAvatars/${req.params.id}.jpg`

			const newAuthors = authors.filter(
				(author) => author._id !== req.params.id
			)
			newAuthors.push(author)
			await writeAuthors(newAuthors)

			res.status(200).send("Image uploaded successfully")
		} catch (error) {
			next(error)
		}
	}
)

export default authorsRouter

















// authorsRouter.get("/exportCSV", async (req, res, next) => {
// 	try {
// 		const source = await authorsReadStream()

// 		const fields = ["name", "surname", "email"]
// 		const opts = { fields }
// 		const json2csv = new Transform(opts)

// 		res.setHeader("Content-Disposition", `attachment; filename=authors.csv`)

// 		pipeline(source, json2csv, res, (error) => {
// 			if (error) next(error)
// 		})
// 	} catch (error) {
// 		next(error)
// 	}
// })
