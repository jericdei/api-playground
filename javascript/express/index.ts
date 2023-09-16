import express from 'express'
import cors from 'cors'
import { Database } from 'bun:sqlite'
import { getSystemErrorMap } from 'sys'
import { dns } from 'bun'

const app = express()
const db = new Database('../../database.sqlite')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const getProvinceById = (id: number) => {
	return db.prepare("SELECT rowid as id, * FROM provinces WHERE id = ? LIMIT 1").get(id);
}

const getProvinceByName = (name: string) => {
	return db.prepare("SELECT rowid as id, * FROM provinces WHERE name = ? LIMIT 1").get(name);
}

app.get('/provinces', (req, res) => {
	const provinces = db.query("SELECT rowid as id, * FROM provinces").all()

	res.send({
		provinces
	})
})

app.get('/provinces/:id', (req, res) => {
	res.send({
		province: getProvinceById(parseInt(req.params.id))
	})
})

app.post('/provinces', (req, res) => {
	if (!req.body.name) {
		res.status(422).send({
			message: "Please enter a name."
		})
	}

	if (getProvinceByName(req.body.name)) {
		res.status(422).send({
			message: "This province already exists."
		})
	}

	db.query("INSERT INTO provinces(name) VALUES (?);").run(req.body.name)

	res.status(201).send({
		message: "Province successfully added.",
		province: getProvinceByName(req.body.name)
	})
})

app.patch('/provinces/:id', (req, res) => {
	if (!getProvinceById(parseInt(req.params.id))) {
		res.status(404).send({
			message: "Province not found."
		});

		return;
	}

	try {
		db.query("UPDATE provinces SET name = ? WHERE rowid = ?").run(
			req.body.name,
			req.params.id
		);

		res.send({
			message: "Province updated successfully.",
			province: getProvinceById(parseInt(req.params.id))
		});
	} catch (err) {
		const error = err as Error;

		res.status(500).send({
			message: 'Something went wrong.',
			error: {
				name: error.name,
				message: error.message,
				cause: error.cause,
				stack: error.stack,
			}
		})
	}
});

app.delete('/provinces/:id', (req, res) => {
	if (!getProvinceById(parseInt(req.params.id))) {
		res.status(404).send({
			message: "Province not found."
		});

		return;
	} 

	try {
		db.query("DELETE FROM provinces WHERE rowid = ?").run(req.params.id);

		res.send({
			message: "Province deleted successfully."
		})
	} catch (err) {
		const error = err as Error;

		res.status(500).send({
			message: 'Something went wrong.',
			error: {
				name: error.name,
				message: error.message,
				cause: error.cause,
				stack: error.stack,
			}
		})
	}
});

app.listen(3000, () => {
	console.log('Listening on http://localhost:3000')
})