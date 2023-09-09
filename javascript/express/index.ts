import express from 'express'
import cors from 'cors'
import { Database } from 'bun:sqlite'

const app = express()

const db = new Database('../../database.sqlite')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/provinces', (req, res) => {
	const provinces = db.query("SELECT rowid as id, name FROM provinces").all()

	res.send({
		provinces
	})
})

app.post('/provinces', (req, res) => {
	if (!req.body.name) {
		res.send({
			message: "Please enter a name."
		})
	}

	db.query("INSERT INTO provinces(name) VALUES (?);").get(req.body.name)

	res.send({
		message: "Province successfully added."
	})
})

app.listen(3000, () => {
	console.log('Listening on http://localhost:3000')
})