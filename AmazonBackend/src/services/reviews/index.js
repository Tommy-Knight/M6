import express from "express"
import models from "../../db/index.js"
import createError from "http-errors"

const Review = models.Review

const router = express.Router()

router
	.route("/")
	.get(async (req, res, next) => {
		try {
			const data = await Review.findAll({
				offset: req.query.offset,
				limit: req.query.limit,
			})
			res.send(data)
		} catch (error) {
			next(error.message)
		}
	})

	.post(async (req, res, next) => {
		try {
			if (!req.body.productId) next(createError(400, "Product ID required"))
			else {
				const data = await Review.create(req.body)
				res.send(data)
			}
		} catch (error) {
			next(error)
		}
	})

router
	.route("/:id")
	.get(async (req, res, next) => {
		try {
			const data = await Review.findByPk(req.params.id)
			res.send(data)
		} catch (error) {
			next(error.message)
		}
	})

	.put(async (req, res, next) => {
		try {
			const data = await Review.update(req.body, {
				where: { _id: req.params.id },
				returning: true,
			})
			if (data[0] === 1) res.send(data[1][0])
			else res.status(404).send("ID not found")
		} catch (error) {
			next(error.message)
		}
	})

	.delete(async (req, res, next) => {
		try {
			const row = await Review.destroy({ where: { _id: req.params.id } })
			if (row > 0) res.send("Deleted")
			else res.status(404).send("ID not found")
		} catch (error) {
			next(error.message)
		}
	})

export default router
