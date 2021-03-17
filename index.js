const express = require('express')
const bodyParser = require('body-parser')
const CONFIG = require('./config')
const app = express()

const db = require('./queries')

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/')

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)


app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(CONFIG.port, () => {
  console.log(`App running on port ${CONFIG.port}`)
})

