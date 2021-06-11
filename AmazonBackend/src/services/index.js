import express from "express"
import productsRoute from "./products/index.js"
import reviewsRoute from "./reviews/index.js"

const route = express.Router()

route.use("/products", productsRoute)
route.use("/reviews", reviewsRoute)

export default route
