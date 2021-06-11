import express from "express"
import models from "../../db/index.js"
import createError from "http-errors"

const { Product, Category, ProductCategory, Review } = models
const router = express.Router()

router
	.route("/")
	.get(async (req, res, next) => {
		try {
			const data = await Product.findAll({
				include: {
					model: Category,
					through: { attributes: [] },
					where: req.query.category ? { _id: req.query.category } : null,
				},
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
			const data = await Product.create(req.body)
			res.send(data)
		} catch (error) {
			next(error.message)
		}
	})

router
	.route("/:id")
	.get(async (req, res, next) => {
		try {
			const data = await Product.findByPk(req.params.id, {
				include: {
					model: Review,
					attributes: {
						exclude: ["productId"],
					},
				},
			})
			if (data) res.send(data)
			else next(createError(404, "ID not found"))
		} catch (error) {
			next(error.message)
		}
	})

	.put(async (req, res, next) => {
		try {
			const data = await Product.update(req.body, {
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
			const row = await Product.destroy({ where: { _id: req.params.id } })
			if (row > 0) res.send("Deleted")
			else res.status(404).send("ID not found")
		} catch (error) {
			next(error.message)
		}
	})
router.route("/:id/reviews").get(async (req, res, next) => {
	try {
		const data = await Product.findByPk(req.params.id, {
			include: { model: Review, attributes: { exclude: ["productId"] } },
			attributes: ["_id", "name", "brand"],
		})
		res.send(data)
	} catch (error) {
		next(error.message)
	}
})

export default router
