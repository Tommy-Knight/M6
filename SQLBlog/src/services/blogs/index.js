import { Router } from "express"
import query from "../../utils/db/index.js"

const route = Router()

route.get("/", async (req, res, next) => {
	try {
		const dbResponse = await query(
			"SELECT * FROM blogs ORDER BY created_at DESC"
		)
		res.send(dbResponse)
	} catch (error) {
		res.status(500).send({ error })
	}
})

route.get("/:id", async (req, res, next) => {
	try {
		const dbResponse = await query(
			`SELECT * FROM blogs WHERE id=${req.params.id}`
		)
		res
			.status(dbResponse ? 200 : 404)
			.send(dbResponse ? dbResponse : { error: "blog not found" })
	} catch (error) {
		res.status(500).send({ error })
	}
})

route.put("/:id", async (req, res, next) => {
	try {
		const { category, title, cover, read_time_value, read_time_unit, content } =
			req.body
		const dbResponse = await query(
			`UPDATE blogs SET category='${category}',title='${title}', cover='${cover}', read_time_value=${read_time_value}, read_time_unit='${read_time_unit}', content='${content}' WHERE id=${req.params.id} RETURNING *`
		)
		res.send(dbResponse)
	} catch (error) {
		res.status(500).send({ error })
	}
})

route.post("/", async (req, res, next) => {
	try {
		const {
			category,
			title,
			cover,
			read_time_value,
			read_time_unit,
			author,
			content,
		} = req.body
		const dbResponse = await query(
			`INSERT INTO blogs (category,title,cover,read_time_value,read_time_unit,author,content) VALUES('${category}', '${title}', '${cover}', ${read_time_value}, '${read_time_unit}', ${author}, '${content}') RETURNING *`
		)
		res.send(dbResponse)
	} catch (error) {
		res.status(500).send({ error: error.message })
	}
})

route.delete("/:id", async (req, res, next) => {
	try {
		const dbResponse = await query(
			`DELETE FROM blogs WHERE id=${req.params.id}`
		)
		res.send(dbResponse)
	} catch (error) {
		res.status(500).send({ error })
	}
})
export default route
