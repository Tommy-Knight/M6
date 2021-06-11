const express = require("express")
const Cart = require("../../db").Cart
const Product = require("../../db").Product
const User = require("../../db").User
const Category = require("../../db").Category
const { Sequelize } = require("../../db").sequelize
const router = express.Router()

router.route("/:userId").get(async (req, res, next) => {
	try {
		// select  "productId", p.id,  p.name, p.price, "categoryId", count("productId") as unitaryPrice
		// from carts as c
		// inner join products as p
		// on c."productId"=p.id
		// group by "productId", p.id
		const cart = await Cart.findAll({
			attributes: [
				"productId",

				[Sequelize.fn("COUNT", Sequelize.col("productId")), "unitaryQty"],
				[Sequelize.fn("SUM", Sequelize.col("product.price")), "unitaryPrice"],
			],
			group: ["productId", "product.id", "user.id", "product->category.id"],
			include: [{ model: Product, include: Category }, User],
		})

		const totalQty = await Cart.count({ where: { userId: req.params.userId } })

		const totalPrice = await Cart.sum("product.price", {
			where: { userId: req.params.userId },
			include: { model: Product, attributes: [] },
		})
		res.send({ cart, totalPrice, totalQty })
	} catch (e) {
		console.log(e)
		next(e)
	}
})
router
	.route("/:userId/:productId")
	.post(async (req, res, next) => {
		try {
			const rawCart = await Cart.create({
				productId: req.params.productId,
				userId: req.params.userId,
			})
			res.send(rawCart)
		} catch (e) {
			console.log(e)
			next(e)
		}
	})
	.delete(async (req, res, next) => {
		try {
		} catch (e) {
			console.log(e)
			next(e)
		}
	})

module.exports = router
